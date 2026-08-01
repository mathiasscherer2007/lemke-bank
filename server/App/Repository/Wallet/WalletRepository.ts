import { Transaction } from "../../Model/Transaction.js";
import { Wallet } from "../../Model/Wallet.js";

export interface WalletRepository
{
    create(wallet: Wallet, userId: string): Promise<void>;
    findById(id: string): Promise<Wallet | null>;
    findByUserId(userId: string): Promise<Wallet | null>;
    findEntries(id: string, month: number, year: number): Promise<Transaction[]>
}



// Token for service provider declaration.
export const WalletRepository = 'WalletRepository';