import { UserNotFoundException, WalletNotFoundException } from "../Exception/DomainException.js";
import { User } from "../Model/User.js";
import { Wallet } from "../Model/Wallet.js";
import { StatementRepository } from "../Repository/Statement/StatementRepository.js";
import { UserRepository } from "../Repository/User/UserRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";

export class WalletManagementService
{
    private readonly recentTransacionsLimit: number = 10;

    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly userRepository: UserRepository,
        private readonly statementRepository: StatementRepository,
    ){}

    public async getWalletData(id: string): Promise<{ user: User, wallet: Wallet }>
    {        
        const wallet = await this.walletRepository.findById(id);
        if(!wallet) throw new WalletNotFoundException(id);

        const user = await this.userRepository.findById(wallet.getUserId());
        if(!user) throw new UserNotFoundException(wallet.getUserId());

        return { user, wallet };
    }

    public async getOverview(userId: string)
    {
        const wallet = await this.walletRepository.findByUserId(userId);
        if(!wallet) throw new WalletNotFoundException(undefined, userId);

        const transactions = await this.statementRepository.findRecentTransactions(wallet!.getId(), this.recentTransacionsLimit);
        
        return {
            wallet,
            recentTransactions: transactions
        };
    }
}