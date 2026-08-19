import { WalletNotFoundException } from "../Exception/DomainException.js";
import { StatementRepository } from "../Repository/Statement/StatementRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class WalletManagementService
{
    private readonly recentTransacionsLimit: number = 10;

    constructor(
        private readonly walletStatement: WalletRepository,
        private readonly statementRepository: StatementRepository,
    ){}

    public async getWalletData(id: string)
    {        
        const wallet = this.walletStatement.findById(id);
        return wallet;
    }

    public async getOverview(userId: string)
    {
        const wallet = await this.walletStatement.findByUserId(userId);
        if(!wallet) throw new WalletNotFoundException(undefined, userId);

        const transactions = await this.statementRepository.findRecentTransactions(wallet!.getId(), this.recentTransacionsLimit);
        
        return {
            wallet,
            recentTransactions: transactions
        };
    }
}