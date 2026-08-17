import crypto from "node:crypto";
import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { AuthService } from "../../App/Service/AuthService.js";
import {
    ConfirmPasswordDoNotMatchException,
    EmailAlreadyExistsException,
    UserNotFoundException,
    WrongPasswordException,
} from "../../App/Exception/DomainException.js";
import { User } from "../../App/Model/User.js";
import { UserRole } from "../../App/Model/Enum/UserRole.js";
import { TokenType } from "../../App/Model/Enum/TokenType.js";
import { MockUserRepository } from "../../App/Repository/User/MockUserRepository.js";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";
import { MockTokenBlacklistingService } from "../../App/Service/TokenBlacklistingService/MockBlacklistingService.js";
import { MockTokenService } from "../../App/Service/TokenService/MockTokenService.js";

function createService() {
    const users = new MockUserRepository();
    const wallets = new MockWalletRepository();
    const tokens = new MockTokenService();
    const blacklist = new MockTokenBlacklistingService();

    return {
        service: new AuthService(users, wallets, tokens, blacklist),
        users,
        wallets,
        tokens,
        blacklist,
    };
}

describe("AuthService", () => {
    test("register persists a hashed password, provisions a wallet, and returns both tokens without the password hash", async () => {
        const { service, users, wallets, tokens } = createService();

        const result = await service.register({
            username: "alice",
            email: "alice@example.com",
            password: "secret-password",
            confirmPassword: "secret-password",
        });

        assert.strictEqual(users.savedUsers.length, 1);
        assert.strictEqual(
            users.savedUsers[0].getPasswordHash(),
            crypto.createHash("sha256").update("secret-password").digest("hex"),
        );
        assert.notStrictEqual(users.savedUsers[0].getPasswordHash(), "secret-password");
        assert.strictEqual(wallets.createdWallets.length, 1);
        assert.strictEqual(wallets.createdWallets[0].getUserId(), users.savedUsers[0].getId());
        assert.deepStrictEqual(tokens.signCalls.map((call) => call.type), [
            TokenType.ACCESS_TOKEN,
            TokenType.REFRESH_TOKEN,
        ]);
        assert.deepStrictEqual(result, {
            accessToken: "access-token",
            accessTokenTTL: 600,
            refreshToken: "refresh-token",
            refreshTokenTTL: 3_600,
            user: {
                id: users.savedUsers[0].getId(),
                email: "alice@example.com",
                username: "alice",
                createdAt: undefined,
                updatedAt: undefined,
            },
        });
        assert.ok(!("passwordHash" in result.user));
    });

    test("register rejects an existing email without creating credentials, wallets, or tokens", async () => {
        const { service, users, wallets, tokens } = createService();
        users.seed(new User("alice@example.com", "existing-hash", "alice", UserRole.USER));

        await assert.rejects(
            service.register({
                username: "another-alice",
                email: "alice@example.com",
                password: "secret-password",
                confirmPassword: "secret-password",
            }),
            EmailAlreadyExistsException,
        );

        assert.strictEqual(users.savedUsers.length, 0);
        assert.strictEqual(wallets.createdWallets.length, 0);
        assert.strictEqual(tokens.signCalls.length, 0);
    });

    test("register rejects mismatched passwords before creating credentials, wallets, or tokens", async () => {
        const { service, users, wallets, tokens } = createService();

        await assert.rejects(
            service.register({
                username: "alice",
                email: "alice@example.com",
                password: "secret-password",
                confirmPassword: "different-password",
            }),
            ConfirmPasswordDoNotMatchException,
        );

        assert.strictEqual(users.savedUsers.length, 0);
        assert.strictEqual(wallets.createdWallets.length, 0);
        assert.strictEqual(tokens.signCalls.length, 0);
    });

    test("authenticate rejects an unknown user without issuing tokens", async () => {
        const { service, tokens } = createService();

        await assert.rejects(
            service.authenticate({ email: "missing@example.com", password: "secret-password" }),
            UserNotFoundException,
        );

        assert.strictEqual(tokens.signCalls.length, 0);
    });

    test("authenticate rejects an invalid password without issuing tokens", async () => {
        const { service, users, tokens } = createService();
        users.seed(
            new User(
                "alice@example.com",
                crypto.createHash("sha256").update("secret-password").digest("hex"),
                "alice",
                UserRole.USER,
            ),
        );

        await assert.rejects(
            service.authenticate({ email: "alice@example.com", password: "wrong-password" }),
            WrongPasswordException,
        );

        assert.strictEqual(tokens.signCalls.length, 0);
    });

    test("authenticate returns both token types without exposing the password hash", async () => {
        const { service, users, tokens } = createService();
        const user = new User(
            "alice@example.com",
            crypto.createHash("sha256").update("secret-password").digest("hex"),
            "alice",
            UserRole.USER,
        );
        users.seed(user);

        const result = await service.authenticate({
            email: "alice@example.com",
            password: "secret-password",
        });

        assert.strictEqual(result.accessToken, "access-token");
        assert.strictEqual(result.refreshToken, "refresh-token");
        assert.deepStrictEqual(tokens.signCalls.map((call) => call.type), [
            TokenType.ACCESS_TOKEN,
            TokenType.REFRESH_TOKEN,
        ]);
        assert.deepStrictEqual(result.user, {
            id: user.getId(),
            email: "alice@example.com",
            username: "alice",
            createdAt: undefined,
            updatedAt: undefined,
        });
        assert.ok(!("passwordHash" in result.user));
    });

    test("revokeToken blacklists the decoded token", async () => {
        const { service, tokens, blacklist } = createService();
        tokens.decodedToken = { jti: "refresh-token-id", sub: "user-id" };

        await service.revokeToken("refresh-token");

        assert.strictEqual(await blacklist.exists(tokens.decodedToken), true);
    });
});
