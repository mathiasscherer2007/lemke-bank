import { StatementRepository } from "./StatementRepository.js";
import { StatementTransaction } from "../../Model/StatementTransaction.js";

type StatementRecord = {
    walletId: string;
    transaction: StatementTransaction;
};

export class MockStatementRepository implements StatementRepository
{
    private readonly transactions: StatementRecord[] = [];

    public async findTransactions(
        walletId: string,
        startDate: Date,
        endDate: Date,
    ): Promise<StatementTransaction[]>
    {
        return this.transactions
            .filter(({ walletId: id, transaction }) =>
                id === walletId &&
                (transaction.toPrimitives().createdAt as Date) >= startDate &&
                (transaction.toPrimitives().createdAt as Date) < endDate,
            )
            .map(({ transaction }) => transaction)
            .sort(
                (a, b) => (b.toPrimitives().createdAt as Date).getTime() - (a.toPrimitives().createdAt as Date).getTime(),
            );
    }

    public async findRecentTransactions(walletId: string, limit: number): Promise<StatementTransaction[]>
    {
        return this.transactions
            .filter(({ walletId: id }) => id === walletId)
            .map(({ transaction }) => transaction)
            .sort(
                (a, b) => (b.toPrimitives().createdAt as Date).getTime() - (a.toPrimitives().createdAt as Date).getTime(),
            )
            .slice(0, limit);
    }

    public addTransaction(
        walletId: string,
        transaction: StatementTransaction,
    ): void
    {
        this.transactions.push({
            walletId,
            transaction,
        });
    }

    public clear(): void
    {
        this.transactions.length = 0;
    }
}