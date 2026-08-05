import { StatementTransaction } from "../../Model/StatementTransaction.js";

export interface StatementRepository {
    findTransactions(walletId: string, startDate: Date, endDate: Date): Promise<StatementTransaction[]>;
}