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
});
