import { CreateChargeDTO } from "../Dto/Request.js";
import { WalletNotFoundException } from "../Exception/DomainException.js";
import { Charge } from "../Model/Charge.js";
import { ChargeRepository } from "../Repository/Charge/ChargeRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class ChargeCreationService
{
    constructor(
        private readonly chargeRepository: ChargeRepository,
        private readonly walletRepository: WalletRepository
    ){}

    public async create(payload: CreateChargeDTO, userId: string): Promise<Charge>
    {
        const issuerWallet = await this.walletRepository.findByUserId(userId);

        if(!issuerWallet) throw new WalletNotFoundException(undefined, userId);

        const { amount, description } = payload;
        const charge = new Charge(issuerWallet.getId(), amount, description);

        await this.chargeRepository.create(charge);
        
        const createdCharge = await this.chargeRepository.findById(charge.getId());
        return createdCharge!;
    }
}