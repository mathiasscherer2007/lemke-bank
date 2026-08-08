import { Statement } from "../../App/Model/Statement.js";
import { StatementTransaction } from "../../App/Model/StatementTransaction.js";
import { StatementEntry } from "../../Config/Types/domain.js";
import { describe, test } from "node:test";
import assert from "node:assert/strict";

function createEntry(
    balanceBefore: number,
    balanceAfter: number,
    createdAt: Date,
): StatementEntry {
    return {
        id: crypto.randomUUID(),
        counterpartyWalletId: crypto.randomUUID(),
        amount: 100,
        type: "DEBIT",
        balanceBefore,
        balanceAfter,
        createdAt,
        relatedUser: {
            id: crypto.randomUUID(),
            username: "John",
        },
    };
}

function createTransaction(
    id: string,
    createdAt: Date,
    entries: StatementEntry[],
): StatementTransaction {
    return new StatementTransaction(
        id,
        100,
        null,
        entries,
        createdAt,
    );
}

describe("Statement", () => {
    test("should return zero when there are no transactions", () => {
        const statement = new Statement("wallet", []);

        assert.equal(statement.getOpeningBalance(), 0);
    });

    test("should return the opening balance of the oldest transaction", () => {
        const oldest = createTransaction(
            "1",
            new Date("2026-08-01"),
            [createEntry(1000, 900, new Date("2026-08-01"))],
        );

        const newest = createTransaction(
            "2",
            new Date("2026-08-02"),
            [createEntry(900, 800, new Date("2026-08-02"))],
        );

        const statement = new Statement("wallet", [
            newest,
            oldest,
        ]);

        assert.equal(statement.getOpeningBalance(), 1000);
    });

    test("should group transactions from the same date", () => {
        const date = new Date("2026-08-01");

        const statement = new Statement("wallet", [
            createTransaction("1", date, [
                createEntry(1000, 900, date),
            ]),
            createTransaction("2", date, [
                createEntry(900, 850, date),
            ]),
        ]);

        const groups = statement.groupByDate();

        assert.equal(groups.length, 1);
        assert.equal(groups[0].transactions.length, 2);
        assert.equal(groups[0].closingBalance, 850);
    });

    test("should create one group for each date", () => {
        const statement = new Statement("wallet", [
            createTransaction(
                "1",
                new Date("2026-08-01"),
                [createEntry(1000, 900, new Date("2026-08-01"))],
            ),
            createTransaction(
                "2",
                new Date("2026-08-02"),
                [createEntry(900, 800, new Date("2026-08-02"))],
            ),
        ]);

        const groups = statement.groupByDate();

        assert.equal(groups.length, 2);
    });

    test("should use the last transaction balance as closing balance", () => {
        const date = new Date("2026-08-01");

        const statement = new Statement("wallet", [
            createTransaction("1", date, [
                createEntry(1000, 900, date),
            ]),
            createTransaction("2", date, [
                createEntry(900, 700, date),
            ]),
        ]);

        const groups = statement.groupByDate();

        assert.equal(groups[0].closingBalance, 700);
    });
})