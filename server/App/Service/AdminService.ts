import { UserRepository } from "../Repository/User/UserRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { RichestUserWallet } from "../../Config/Types/domain.js";
import { UserRole } from "../Model/Enum/UserRole.js";
import { UserRoleNotAllowedException } from "../Exception/DomainException.js";

export class AdminService
{
    private readonly topEarnersLimit: number = 5;

    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly userRepository: UserRepository
    ){}

    public async getOverview(role: UserRole): Promise<{
        topEarners: RichestUserWallet[],
        totalBalance: number,
        totalUsers: number
    }>
    {
        if(role !== UserRole.ADMIN){
            throw new UserRoleNotAllowedException(role);
        }

        const topEarners = await this.walletRepository.getMostRichestUserWallets(this.topEarnersLimit);
        const totalBalance = await this.walletRepository.getTotalBalance();
        const totalUsers = await this.userRepository.getTotalUsersCount();

        return {
            topEarners,
            totalBalance,
            totalUsers
        };
    }
}