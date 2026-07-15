import { Transaction } from "../../Model/Transaction.js";

export interface TransactionRepository {
    create(transaction: Transaction): Promise<void>;
    findById(id: string): Promise<Transaction | null>;
}