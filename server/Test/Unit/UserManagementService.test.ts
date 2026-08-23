import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { UserManagementService } from "../../App/Service/UserManagementService.js";
import {
    UserNotFoundException,
    WalletNotFoundException,
} from "../../App/Exception/DomainException.js";
import { User } from "../../App/Model/User.js";
import { UserRole } from "../../App/Model/Enum/UserRole.js";
import { UserStatus } from "../../App/Model/Enum/UserStatus.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";
import { MockUserRepository } from "../../App/Repository/User/MockUserRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";

const createUser = (id: string, username = id): User => {
    return new User(
        `${id}@example.com`,
        "hashed-password",
        username,
        UserRole.USER,
        id,
    );
};

describe("UserManagementService", () => {
    test("searchUser returns matching users with the explicit limit", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new UserManagementService(userRepository, walletRepository);

        userRepository.seed(createUser("user-1", "Alice"), "wallet-1");
        userRepository.seed(createUser("user-2", "Alina"), "wallet-2");
        userRepository.seed(createUser("user-3", "Alison"), "wallet-3");

        const result = await service.searchUser("ali", 2);

        assert.strictEqual(result.length, 2);
        assert.deepStrictEqual(result.map((user) => user.id), ["user-1", "user-2"]);
    });

    test("searchUser uses the default limit of 30 when no limit is provided", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new UserManagementService(userRepository, walletRepository);

        for (let index = 1; index <= 31; index += 1) {
            const id = `user-${index}`;
            userRepository.seed(createUser(id, `User ${index}`), `wallet-${index}`);
        }

        const result = await service.searchUser("user");

        assert.strictEqual(result.length, 30);
    });

    test("deleteUser disables and persists both the user and wallet", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new UserManagementService(userRepository, walletRepository);
        const user = createUser("user-1");
        const wallet = new Wallet("user-1", WalletStatus.ACTIVE, 100, "wallet-1");

        await userRepository.save(user);
        await walletRepository.create(wallet);

        await service.deleteUser("user-1");

        const storedUser = await userRepository.findById("user-1");
        const storedWallet = await walletRepository.findById("wallet-1");
        assert.strictEqual((storedUser?.toPrimitives() as Record<string, unknown>).status, UserStatus.DISABLED);
        assert.strictEqual((storedWallet?.toPrimitives() as Record<string, unknown>).status, WalletStatus.DISABLED);
    });

    test("deleteUser throws UserNotFoundException for an unknown user", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new UserManagementService(userRepository, walletRepository);

        await assert.rejects(
            service.deleteUser("missing-user"),
            (error: unknown) => {
                assert.ok(error instanceof UserNotFoundException);
                assert.strictEqual((error as UserNotFoundException).statusCode, 404);
                return true;
            },
        );
    });

    test("deleteUser throws WalletNotFoundException and leaves the user active when no wallet exists", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new UserManagementService(userRepository, walletRepository);
        const user = createUser("user-1");

        await userRepository.save(user);

        await assert.rejects(
            service.deleteUser("user-1"),
            (error: unknown) => {
                assert.ok(error instanceof WalletNotFoundException);
                assert.strictEqual((error as WalletNotFoundException).statusCode, 404);
                return true;
            },
        );

        const storedUser = await userRepository.findById("user-1");
        assert.strictEqual((storedUser?.toPrimitives() as Record<string, unknown>).status, UserStatus.ACTIVE);
    });
});
