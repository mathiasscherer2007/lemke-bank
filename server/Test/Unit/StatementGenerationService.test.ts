import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { MockWalletRepository } from "../../App/Repository/Wallet/MockWalletRepository.js";
import { MockStatementRepository } from "../../App/Repository/Statement/MockStatementRepository.js";
import { StatementGenerationService } from "../../App/Service/StatementGenerationService.js";
import { Wallet } from "../../App/Model/Wallet.js";
import { WalletStatus } from "../../App/Model/Enum/WalletStatus.js";    
import { WalletNotFoundException } from "../../App/Exception/DomainException.js";
import { StatementTransaction } from "../../App/Model/StatementTransaction.js";

const createWallet = (id: string, createdAt: Date): Wallet => {
    return new Wallet(
        "user-1",
        WalletStatus.ACTIVE,
        0,
        id,
        createdAt,
    );
};

const createStatementTransaction = (
    id: string,
    balanceBefore: number,
    balanceAfter: number,
    createdAt: Date,
): StatementTransaction => {
    return new StatementTransaction(
        id,
        100,
        "Transfer",
        [
            {
                id: "entry-1",
                counterpartyWalletId: "counterparty-wallet-1",
                amount: 100,
                type: "DEBIT",
                balanceBefore,
                balanceAfter,
                createdAt,
                relatedUser: {
                    id: "user-2",
                    username: "John",
                },
            },
        ],
        createdAt,
    );
};

describe("StatementGenerationService", () => {
    test("should throw WalletNotFoundException when wallet does not exist", async () => {
        const service = new StatementGenerationService(
            new MockWalletRepository(),
            new MockStatementRepository(),
        );

        await assert.rejects(
            () => service.generate("unknown", 8, 2026),
            WalletNotFoundException,
        );
    });

    test("should return an empty statement", async () => {
        const walletRepository = new MockWalletRepository();
        const statementRepository = new MockStatementRepository();

        const wallet = createWallet("wallet-1", new Date(2026, 0, 1));
        await walletRepository.create(wallet);

        const service = new StatementGenerationService(
            walletRepository,
            statementRepository,
        );

        const statement = await service.generate(
            wallet.getId(),
            8,
            2026,
        );

        assert.equal(statement.openingBalance, 0);
        assert.deepEqual(statement.entries, []);
        assert.deepEqual(
            statement.walletCreationDate,
            wallet.getCreationDate(),
        );
    });

    test("should generate a statement", async () => {
        const walletRepository = new MockWalletRepository();
        const statementRepository = new MockStatementRepository();

        const wallet = createWallet("wallet-1", new Date(2026, 0, 1));
        await walletRepository.create(wallet);

        statementRepository.addTransaction(
            wallet.getId(),
            createStatementTransaction(
                "transaction-1",
                1000,
                900,
                new Date(2026, 7, 15),
            ),
        );

        const service = new StatementGenerationService(
            walletRepository,
            statementRepository,
        );

        const statement = await service.generate(
            wallet.getId(),
            8,
            2026,
        );

        assert.equal(statement.openingBalance, 1000);
        assert.equal(statement.entries.length, 1);
        assert.equal(statement.entries[0].transactions.length, 1);
        assert.equal(statement.entries[0].closingBalance, 900);
    });

    test("should ignore transactions outside the requested period", async () => {
        const walletRepository = new MockWalletRepository();
        const statementRepository = new MockStatementRepository();

        const wallet = createWallet("wallet-1", new Date(2026, 0, 1));
        await walletRepository.create(wallet);

        statementRepository.addTransaction(
            wallet.getId(),
            createStatementTransaction(
                "transaction-1",
                1000,
                900,
                new Date(2026, 8, 1),
            ),
        );

        const service = new StatementGenerationService(
            walletRepository,
            statementRepository,
        );

        const statement = await service.generate(
            wallet.getId(),
            8,
            2026,
        );

        assert.equal(statement.entries.length, 0);
    });
});
