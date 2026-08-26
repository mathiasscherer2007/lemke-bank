import { Wallet } from "../../Model/Wallet.js";
import { RichestUserWallet } from "../../Types/domain.js";

export interface WalletRepository
{
    create(wallet: Wallet): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findByUserId(userId: string): Promise<Wallet | null>;
    update(wallet: Wallet): Promise<void>;
    getMostRichestUserWallets(limit: number): Promise<RichestUserWallet[]>;
    getTotalBalance(): Promise<number>;
}



// Token for service provider declaration.
export const WalletRepository = 'WalletRepository';