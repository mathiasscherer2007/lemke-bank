import { Wallet } from "../../Model/Wallet.js";

export interface WalletRepository
{
    create(wallet: Wallet, userId: string): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findByUserId(userId: string): Promise<Wallet | null>;
}



// Token for service provider declaration.
export const WalletRepository = 'WalletRepository';