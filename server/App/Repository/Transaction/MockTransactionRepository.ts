import { Transaction } from "../../Model/Transaction.js";
import { TransactionRepository } from "./TransactionRepository.js";

export class MockTransactionRepository implements TransactionRepository {
    private readonly store: Map<string, Transaction>;

    constructor(initialTransactions: Transaction[] = []) {
        this.store = new Map(initialTransactions.map(transaction => [transaction.getId(), transaction]));
    }

    public async create(transaction: Transaction): Promise<void> {
        this.store.set(transaction.getId(), transaction);
    }

    public async findById(id: string): Promise<Transaction | null> {
        return this.store.get(id) ?? null;
    }

    public clear(): void {
        this.store.clear();
    }
}