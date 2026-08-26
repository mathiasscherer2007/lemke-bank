import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { AdminService } from "../../App/Service/AdminService.js";
import { UserRoleNotAllowedException } from "../../App/Exception/DomainException.js";
import { User } from "../../App/Model/User.js";
import { UserRole } from "../../App/Model/Enum/UserRole.js";
import { UserStatus } from "../../App/Model/Enum/UserStatus.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";
import { MockUserRepository } from "../../App/Repository/User/MockUserRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";

describe("AdminService", () => {
    test("returns the admin overview from the repositories", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new AdminService(walletRepository, userRepository);

        const user = new User("user@example.com", "hash", "User", UserRole.USER, "user-1");
        const disabledUser = new User("disabled@example.com", "hash", "Disabled", UserRole.USER, "user-2");
        disabledUser.setStatus(UserStatus.DISABLED);
        const admin = new User("admin@example.com", "hash", "Admin", UserRole.ADMIN, "admin-1");

        userRepository.seed(user);
        userRepository.seed(disabledUser);
        userRepository.seed(admin);

        walletRepository.seed(
            new Wallet("user-1", WalletStatus.ACTIVE, 250, "wallet-1"),
            user,
        );
        walletRepository.seed(
            new Wallet("user-2", WalletStatus.ACTIVE, 500, "wallet-2"),
            disabledUser,
        );
        walletRepository.seed(
            new Wallet("admin-1", WalletStatus.ACTIVE, 1000, "wallet-3"),
            admin,
        );

        const result = await service.getOverview(UserRole.ADMIN);

        assert.deepStrictEqual(result, {
            topEarners: [
                {
                    id: "wallet-2",
                    balance: 500,
                    createdAt: new Date(0),
                    updatedAt: new Date(0),
                    user: {
                        id: "user-2",
                        email: "disabled@example.com",
                        username: "Disabled",
                    },
                },
                {
                    id: "wallet-1",
                    balance: 250,
                    createdAt: new Date(0),
                    updatedAt: new Date(0),
                    user: {
                        id: "user-1",
                        email: "user@example.com",
                        username: "User",
                    },
                },
            ],
            totalBalance: 750,
            totalUsers: 1,
        });
    });

    test("rejects non-admin roles", async () => {
        const userRepository = new MockUserRepository();
        const walletRepository = new MockWalletRepository();
        const service = new AdminService(walletRepository, userRepository);

        await assert.rejects(
            service.getOverview(UserRole.USER),
            (error: unknown) => {
                assert.ok(error instanceof UserRoleNotAllowedException);
                assert.strictEqual(error.statusCode, 403);
                assert.strictEqual(error.code, "USER_ROLE_NOT_ALLOWED");
                return true;
            },
        );
    });
});
