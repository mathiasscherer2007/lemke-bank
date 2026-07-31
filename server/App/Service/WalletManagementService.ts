import { WalletNotFoundException } from "../Exception/DomainException.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class WalletManagementService
{
    constructor(
        private readonly repository: WalletRepository
    ){}

    public async getWalletData(id: string)
    {        
        const wallet = this.repository.findById(id);
        return wallet;
    }

    public async getStatement(userId: string, month: number, year: number)
    {
        const wallet = await this.repository.findByUserId(userId);

        if(!wallet){
            throw new WalletNotFoundException(undefined, userId);
        }
        
        const entries = await this.repository.findEntries(wallet.getId(), month, year);
        return entries;
    }
}