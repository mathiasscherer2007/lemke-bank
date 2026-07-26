import { Wallet } from "../../Model/Wallet.js";
import { WalletRepository } from "./WalletRepository.js";

export class MockWalletRepository implements WalletRepository {
    private readonly walletsByUserId: Map<string, Wallet> = new Map();
    private readonly walletsById: Map<string, Wallet> = new Map();

    async create(wallet: Wallet, userId: string): Promise<void> {
        this.walletsByUserId.set(userId, wallet);
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

    public clear(): void {
        this.walletsByUserId.clear();
        this.walletsById.clear();
    }
}
