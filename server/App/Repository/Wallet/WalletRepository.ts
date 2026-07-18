import { Wallet } from "../../Model/Wallet.js";

export interface WalletRepository
{
    create(wallet: Wallet, userId: string): Promise<void>;
    findById(id: string): Promise<Wallet>;
    findByUserId(userId: string): Promise<Wallet>;
}