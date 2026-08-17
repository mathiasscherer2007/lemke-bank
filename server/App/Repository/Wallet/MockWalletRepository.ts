import { Transaction } from "../../Model/Transaction.js";
import { Wallet } from "../../Model/Wallet.js";
import { WalletRepository } from "./WalletRepository.js";

export class MockWalletRepository implements WalletRepository {
    public readonly createdWallets: Wallet[] = [];
    private readonly walletsByUserId: Map<string, Wallet> = new Map();
    private readonly walletsById: Map<string, Wallet> = new Map();
    private readonly entriesByWalletId: Map<string, Transaction[]> = new Map();

    async create(wallet: Wallet): Promise<void> {
        this.createdWallets.push(wallet);
        this.walletsByUserId.set(wallet.getUserId(), wallet);
        this.walletsById.set(wallet.getId(), wallet);
    }

    async findById(id: string): Promise<Wallet | null> {
        const wallet = this.walletsById.get(id);
        if (!wallet) return null;
        return wallet;
    }

    async findByUserId(userId: string): Promise<Wallet | null> {
        const wallet = this.walletsByUserId.get(userId);
        if (!wallet) return null;
        return wallet;
    }

    // Return stored entries for a wallet, or empty array when none are set.
    async findEntries(walletId: string, month: number, year: number): Promise<Transaction[]> {
        const entries = this.entriesByWalletId.get(walletId);
        return entries ?? [];
    }

    // Helper for tests to set entries for a wallet
    public addEntries(walletId: string, transactions: Transaction[]): void {
        this.entriesByWalletId.set(walletId, transactions);
    }

    public clear(): void {
        this.createdWallets.length = 0;
        this.walletsByUserId.clear();
        this.walletsById.clear();
        this.entriesByWalletId.clear();
    }
}
