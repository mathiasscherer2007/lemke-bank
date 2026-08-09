import { ChargeNotFoundException, WalletNotFoundException } from "../Exception/DomainException.js";
import { Charge } from "../Model/Charge.js";
import { Transaction } from "../Model/Transaction.js";
import { ChargeRepository } from "../Repository/Charge/ChargeRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { TransactionProcessorService } from "./TransactionProcessorService.js";

export class ChargePaymentService
{
    constructor(
        private readonly chargeRepository: ChargeRepository,
        private readonly walletRepository: WalletRepository,
        private readonly transactionProcessorService: TransactionProcessorService
    ){}

    public async getData(chargeId: string, userId: string): Promise<{ charge: Charge, isIssuerWallet: boolean }>
    {
        const charge = await this.chargeRepository.findById(chargeId);
        if(!charge) throw new ChargeNotFoundException(chargeId);
        
        const wallet = await this.walletRepository.findByUserId(userId);
        if(!wallet) throw new WalletNotFoundException(undefined, userId);

        return { charge: charge, isIssuerWallet: charge.getIssuerWalletId() === wallet.getId() };
    }

    public async makePaymentTransaction():  Promise<Transaction>
    {
        
    }
}