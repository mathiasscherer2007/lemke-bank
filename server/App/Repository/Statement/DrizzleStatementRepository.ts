import { db } from "../../../Config/Database/connection.js";
import { StatementRepository } from "./StatementRepository.js";
import { StatementTransaction } from "../../Model/StatementTransaction.js";
import { ledgerEntries } from "../../../Config/Database/Schema/ledgerEntries.js";
import { transactions } from "../../../Config/Database/Schema/transactions.js";
import { users } from "../../../Config/Database/Schema/users.js";
import { wallets } from "../../../Config/Database/Schema/wallets.js";
import { and, desc, eq, gte, lt, sql } from "drizzle-orm";
import { StatementEntry } from "../../Types/domain.js";

export class DrizzleStatementRepository implements StatementRepository 
{
    public async findTransactions(id: string, startDate: Date, endDate: Date): Promise<StatementTransaction[]>
    {
        const result = await db
            .select({
                id: transactions.id,
                description: transactions.description,
                totalAmount: transactions.amount,
                createdAt: transactions.createdAt,
                entries: sql`
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', ${ledgerEntries.id},
                            'counterpartyWalletId', ${ledgerEntries.counterpartyWalletId},
                            'amount', ${ledgerEntries.amount},
                            'type', ${ledgerEntries.entryType},
                            'balanceBefore', ${ledgerEntries.balanceBefore},
                            'balanceAfter', ${ledgerEntries.balanceAfter},
                            'createdAt', ${ledgerEntries.createdAt},
                            'relatedUser', JSON_OBJECT(
                                'id', ${users.id},
                                'username', ${users.username}
                            )
                        )
                    )
                `.as("entries"),
            })
            .from(ledgerEntries)
            .innerJoin(
                transactions,
                eq(transactions.id, ledgerEntries.transactionId),
            )
            .innerJoin(
                wallets,
                eq(wallets.id, ledgerEntries.counterpartyWalletId),
            )
            .innerJoin(
                users,
                eq(users.id, wallets.userId),
            )
            .where(
                and(
                    eq(ledgerEntries.walletId, id),
                    gte(transactions.createdAt, startDate),
                    lt(transactions.createdAt, endDate),
                ),
            )
            .groupBy(
                transactions.id,
                transactions.description,
                transactions.amount,
                transactions.createdAt,
            )
            .orderBy(desc(transactions.createdAt));

        const statementTransactions: StatementTransaction[] = result.map((row) => {
            const entries = JSON.parse(row.entries as string) as StatementEntry[];
            return new StatementTransaction(
                row.id,
                row.totalAmount,
                row.description,
                entries,
                row.createdAt
            );
        });

        return statementTransactions;
    }
}