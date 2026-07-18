import { strict as assert } from "node:assert";
import { describe, test } from "node:test";
import { MockTransactionRepository } from "../../App/Repository/Transaction/MockTransactionRepository.js";
import { Transaction } from "../../App/Model/Transaction.js";
import { LedgerEntry } from "../../App/Model/LedgerEntry.js";
import { LedgerEntryType } from "../../App/Model/Enum/LedgerEntryType.js";

const createTransaction = () => {
    const entries = [
        new LedgerEntry("wallet-debit-uuid", "wallet-credit-uuid", LedgerEntryType.DEBIT, 100, 200),
        new LedgerEntry("wallet-credit-uuid", "wallet-debit-uuid", LedgerEntryType.CREDIT, 100, 100)
    ];

    return new Transaction(entries, "Test payment", "charge-123", "test-uuid");
};

describe("MockTransactionRepository", () => {
    test("stores and retrieves a transaction by id", async () => {
        const repository = new MockTransactionRepository();
        const transaction = createTransaction();

        await repository.create(transaction);
        const loaded = await repository.findById(transaction.getId());

        assert.strictEqual(loaded, transaction, "findById should return the stored transaction instance");
        assert.strictEqual(loaded?.getId(), "test-uuid", "Returned transaction should have the expected id");
    });

    test("returns null when the transaction does not exist", async () => {
        const repository = new MockTransactionRepository();

        const loaded = await repository.findById("missing-id");

        assert.strictEqual(loaded, null, "findById should return null for an unknown id");
    });

    test("clears stored transactions", async () => {
        const transaction = createTransaction();
        const repository = new MockTransactionRepository([transaction]);

        assert.strictEqual(await repository.findById(transaction.getId()), transaction, "Seeded transaction should be available before clear");

        repository.clear();
        assert.strictEqual(await repository.findById(transaction.getId()), null, "findById should return null after clear");
    });
});
