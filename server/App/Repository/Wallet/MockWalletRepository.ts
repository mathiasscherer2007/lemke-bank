import { Transaction } from "../../Model/Transaction.js";
import { User } from "../../Model/User.js";
import { UserRole } from "../../Model/Enum/UserRole.js";
import { WalletStatus } from "../../Model/Enum/WalletStatus.js";
import { RichestUserWallet } from "../../Types/domain.js";
import { Wallet } from "../../Model/Wallet.js";
import { WalletRepository } from "./WalletRepository.js";

export class MockWalletRepository implements WalletRepository {
    public readonly createdWallets: Wallet[] = [];
    private readonly walletsByUserId: Map<string, Wallet> = new Map();
    private readonly walletsById: Map<string, Wallet> = new Map();
    private readonly entriesByWalletId: Map<string, Transaction[]> = new Map();
    private readonly usersById: Map<string, User> = new Map();

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

    async update(wallet: Wallet): Promise<void> {
        const storedWallet = this.walletsById.get(wallet.getId());
        if (!storedWallet) return;

        if (storedWallet.getUserId() !== wallet.getUserId()) {
            this.walletsByUserId.delete(storedWallet.getUserId());
        }

        this.walletsById.set(wallet.getId(), wallet);
        this.walletsByUserId.set(wallet.getUserId(), wallet);
    }

    async getMostRichestUserWallets(limit: number): Promise<RichestUserWallet[]> {
        if (limit <= 0) return [];

        const fallbackDate = new Date(0);

        return Array.from(this.walletsById.values())
            .filter((wallet) => {
                const primitives = wallet.toPrimitives() as Record<string, unknown>;
                const status = primitives.status ?? WalletStatus.ACTIVE;
                const user = this.usersById.get(wallet.getUserId());

                return status === WalletStatus.ACTIVE && user?.getRole() === UserRole.USER;
            })
            .sort((left, right) => right.getBalance() - left.getBalance())
            .slice(0, Math.floor(limit))
            .map((wallet) => {
                const primitives = wallet.toPrimitives() as Record<string, unknown>;
                const user = this.usersById.get(wallet.getUserId())!;

                return {
                    id: wallet.getId(),
                    balance: wallet.getBalance(),
                    createdAt: (primitives.createdAt as Date | undefined) ?? fallbackDate,
                    updatedAt: (primitives.updatedAt as Date | undefined) ?? fallbackDate,
                    user: {
                        id: user.getId(),
                        email: user.getEmail(),
                        username: user.getUsername(),
                    },
                };
            });
    }

    async getTotalBalance(): Promise<number> {
        return Array.from(this.walletsById.values())
            .filter((wallet) => {
                const primitives = wallet.toPrimitives() as Record<string, unknown>;
                const status = primitives.status ?? WalletStatus.ACTIVE;
                const user = this.usersById.get(wallet.getUserId());

                return status === WalletStatus.ACTIVE && user?.getRole() === UserRole.USER;
            })
            .reduce((total, wallet) => total + wallet.getBalance(), 0);
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

    public seed(wallet: Wallet, user: User): void {
        this.walletsByUserId.set(wallet.getUserId(), wallet);
        this.walletsById.set(wallet.getId(), wallet);
        this.usersById.set(user.getId(), user);
    }

    public clear(): void {
        this.createdWallets.length = 0;
        this.walletsByUserId.clear();
        this.walletsById.clear();
        this.entriesByWalletId.clear();
        this.usersById.clear();
    }
}
