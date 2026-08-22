import { UserNotFoundException, WalletNotFoundException } from "../Exception/DomainException.js";
import { UserStatus } from "../Model/Enum/UserStatus.js";
import { WalletStatus } from "../Model/Enum/WalletStatus.js";
import { User } from "../Model/User.js";
import { UserRepository } from "../Repository/User/UserRepository.js";
import { WalletRepository } from "../Repository/Wallet/WalletRepository.js";
import { SearchedUser } from "../Types/domain.js";

export class UserManagementService 
{
    private readonly DEFAULT_SEARCH_LIMIT = 30;

    constructor(
        private readonly userRepository: UserRepository,
        private readonly walletRepository: WalletRepository
    ){}
    
    public  async searchUser(query: string, limit?: number): Promise<SearchedUser[]> {
        return await this.userRepository.search(query, limit ?? this.DEFAULT_SEARCH_LIMIT);
    }

    public async deleteUser(userId: string): Promise<void> 
    {
        const user = await this.userRepository.findById(userId);
        if (!user) throw new UserNotFoundException(userId);

        const wallet = await this.walletRepository.findByUserId(userId);
        if (!wallet) throw new WalletNotFoundException(undefined, userId);
        
        user.setStatus(UserStatus.DISABLED);
        wallet.setStatus(WalletStatus.DISABLED);
        await this.userRepository.update(user);
        await this.walletRepository.update(wallet);
    }
}