import { Wallet } from "../../Model/Wallet.js";

export interface WalletRepository
{
    create(wallet: Wallet): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findByUserId(userId: string): Promise<Wallet | null>;
    update(wallet: Wallet): Promise<void>;
}



// Token for service provider declaration.
export const WalletRepository = 'WalletRepository';