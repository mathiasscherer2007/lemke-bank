import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { User } from "../../App/Model/User.js";
import { UserRole } from "../../App/Model/Enum/UserRole.js";
import { UserStatus } from "../../App/Model/Enum/UserStatus.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";
import { MockUserRepository } from "../../App/Repository/User/MockUserRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";

describe("MockUserRepository", () => {
    test("updates a stored user and refreshes the email index", async () => {
        const repository = new MockUserRepository();
        const original = new User("old@example.com", "hash", "old-name", UserRole.USER, "user-1");
        const updated = new User("new@example.com", "hash", "new-name", UserRole.USER, "user-1");

        await repository.save(original);
        await repository.update(updated);

        assert.strictEqual(await repository.findById("user-1"), updated);
        assert.strictEqual(await repository.findByEmail("old@example.com"), null);
        assert.strictEqual(await repository.findByEmail("new@example.com"), updated);
        assert.deepStrictEqual(repository.savedUsers, [updated]);
    });

    test("searches active users by username or email with a limit", async () => {
        const repository = new MockUserRepository();
        const alice = new User("alice@example.com", "hash", "Alice", UserRole.USER, "user-1");
        const alina = new User("alina@example.com", "hash", "Alina", UserRole.USER, "user-2");
        const disabled = new User("disabled@example.com", "hash", "Disabled", UserRole.USER, "user-3");
        disabled.setStatus(UserStatus.DISABLED);

        repository.seed(alice, "wallet-1");
        repository.seed(alina, "wallet-2");
        repository.seed(disabled, "wallet-3");
        repository.seed(new User("unmapped@example.com", "hash", "Alice Unmapped", UserRole.USER, "user-4"));

        const results = await repository.search("AL", 1);

        assert.strictEqual(results.length, 1);
        assert.deepStrictEqual(results[0], {
            id: "user-1",
            email: "alice@example.com",
            username: "Alice",
            walletId: "wallet-1",
            createdAt: new Date(0),
            updatedAt: new Date(0),
        });
    });

    test("counts active regular users only", async () => {
        const repository = new MockUserRepository();
        const activeUser = new User("active@example.com", "hash", "Active", UserRole.USER, "user-1");
        const disabledUser = new User("disabled@example.com", "hash", "Disabled", UserRole.USER, "user-2");
        const admin = new User("admin@example.com", "hash", "Admin", UserRole.ADMIN, "user-3");
        disabledUser.setStatus(UserStatus.DISABLED);

        repository.seed(activeUser);
        repository.seed(disabledUser);
        repository.seed(admin);

        assert.strictEqual(await repository.getTotalUsersCount(), 1);
    });
});

describe("MockWalletRepository", () => {
    test("updates a wallet by ID and refreshes the user ID index", async () => {
        const repository = new MockWalletRepository();
        const original = new Wallet("user-1", WalletStatus.ACTIVE, 100, "wallet-1");
        const updated = new Wallet("user-2", WalletStatus.ACTIVE, 250, "wallet-1");

        await repository.create(original);
        await repository.update(updated);

        assert.strictEqual(await repository.findById("wallet-1"), updated);
        assert.strictEqual(await repository.findByUserId("user-1"), null);
        assert.strictEqual(await repository.findByUserId("user-2"), updated);
    });

    test("does nothing when updating an unknown wallet", async () => {
        const repository = new MockWalletRepository();
        const wallet = new Wallet("user-1", WalletStatus.ACTIVE, 100, "wallet-1");

        await repository.update(wallet);

        assert.strictEqual(await repository.findById("wallet-1"), null);
        assert.strictEqual(await repository.findByUserId("user-1"), null);
    });

    test("returns richest active regular-user wallets in descending order", async () => {
        const repository = new MockWalletRepository();
        const user1 = new User("one@example.com", "hash", "One", UserRole.USER, "user-1");
        const user2 = new User("two@example.com", "hash", "Two", UserRole.USER, "user-2");
        const admin = new User("admin@example.com", "hash", "Admin", UserRole.ADMIN, "admin-1");
        const richest = new Wallet("user-1", WalletStatus.ACTIVE, 300, "wallet-1");
        const second = new Wallet("user-2", WalletStatus.ACTIVE, 200, "wallet-2");
        const disabled = new Wallet("user-2", WalletStatus.DISABLED, 500, "wallet-3");
        const adminWallet = new Wallet("admin-1", WalletStatus.ACTIVE, 1000, "wallet-4");
        const unmapped = new Wallet("missing-user", WalletStatus.ACTIVE, 900, "wallet-5");

        repository.seed(second, user2);
        repository.seed(disabled, user2);
        repository.seed(adminWallet, admin);
        repository.seed(unmapped, user1);
        repository.seed(richest, user1);

        const result = await repository.getMostRichestUserWallets(2);

        assert.deepStrictEqual(result, [
            {
                id: "wallet-1",
                balance: 300,
                createdAt: new Date(0),
                updatedAt: new Date(0),
                user: {
                    id: "user-1",
                    email: "one@example.com",
                    username: "One",
                },
            },
            {
                id: "wallet-2",
                balance: 200,
                createdAt: new Date(0),
                updatedAt: new Date(0),
                user: {
                    id: "user-2",
                    email: "two@example.com",
                    username: "Two",
                },
            },
        ]);
    });

    test("totals balances for active wallets belonging to regular users", async () => {
        const repository = new MockWalletRepository();
        const user = new User("user@example.com", "hash", "User", UserRole.USER, "user-1");
        const admin = new User("admin@example.com", "hash", "Admin", UserRole.ADMIN, "admin-1");

        repository.seed(new Wallet("user-1", WalletStatus.ACTIVE, 125, "wallet-1"), user);
        repository.seed(new Wallet("user-1", WalletStatus.DISABLED, 500, "wallet-2"), user);
        repository.seed(new Wallet("admin-1", WalletStatus.ACTIVE, 1000, "wallet-3"), admin);

        assert.strictEqual(await repository.getTotalBalance(), 125);
    });

    test("returns zero for an empty qualifying wallet set", async () => {
        const repository = new MockWalletRepository();

        assert.strictEqual(await repository.getTotalBalance(), 0);
        assert.deepStrictEqual(await repository.getMostRichestUserWallets(5), []);
    });
});
