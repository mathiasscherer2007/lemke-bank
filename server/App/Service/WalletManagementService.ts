import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class WalletManagementService
{
    constructor(
        private readonly repository: WalletRepository
    ){}

    public async getWalletData(id: string)
    {        
        const wallet = this.repository.findById(id);
        // TODO: Get user information by wallet id.
    }
}