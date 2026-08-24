import { PaymentByWalletIdDTO } from "../Dto/Request.js";
import { ChargeNotFoundException, ChargePaidOrExpiredException, UserNotFoundException, WalletNotFoundException } from "../Exception/DomainException.js";
import { Charge } from "../Model/Charge.js";
import { Transaction } from "../Model/Transaction.js";
import { User } from "../Model/User.js";
import { ChargeRepository } from "../Repository/Charge/ChargeRepository.js";
import { UserRepository } from "../Repository/User/UserRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { TransactionProcessorService } from "./TransactionProcessorService.js";

export class ChargePaymentService
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly chargeRepository: ChargeRepository,
        private readonly walletRepository: WalletRepository,
        private readonly transactionProcessorService: TransactionProcessorService
    ){}

    public async getData(chargeId: string, userId: string): Promise<{ charge: Charge, issuer: User, isIssuerWallet: boolean }>
    {
        const charge = await this.chargeRepository.findById(chargeId);
        if(!charge) throw new ChargeNotFoundException(chargeId);
        
        const wallet = await this.walletRepository.findByUserId(userId);
        if(!wallet) throw new WalletNotFoundException(undefined, userId);

        const user = await this.userRepository.findById(wallet.getUserId());
        if(!user) throw new UserNotFoundException(wallet.getUserId());

        return { charge: charge, issuer: user, isIssuerWallet: charge.getIssuerWalletId() === wallet.getId() };
    }

    public async makePaymentTransaction(chargeId: string, userId: string):  Promise<Transaction>
    {
        const charge = await this.chargeRepository.findById(chargeId);
        if(!charge) throw new ChargeNotFoundException(chargeId);

        const payerWallet = await this.walletRepository.findByUserId(userId);
        if(!payerWallet) throw new WalletNotFoundException(undefined, userId);

        if(charge.isExpired()){
            throw new ChargePaidOrExpiredException(chargeId);
        }

        charge.pay(payerWallet.getId());

        const payload: PaymentByWalletIdDTO = {
            toWalletId: charge.getIssuerWalletId(),
            amount: charge.getAmount(),
            description: charge.getDescription()
        }

        const transaction = await this.transactionProcessorService.process(payload, userId);
        
        charge.attachTransaction(transaction.getId());
        await this.chargeRepository.update(charge);

        return transaction;
    }
}