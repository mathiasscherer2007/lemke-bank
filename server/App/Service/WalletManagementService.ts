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

    public async getStatement(id: string, date: Date)
    {
        const month = date.getMonth();
        const year = date.getFullYear();
        
        const entries = this.repository.findEntries(id, month, year);
        return entries;
    }
}