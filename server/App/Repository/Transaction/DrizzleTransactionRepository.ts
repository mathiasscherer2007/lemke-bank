import { eq } from "drizzle-orm";
import { db } from "../../../Config/Database/connection";
import { ledgerEntries } from "../../../Config/Database/Schema/ledgerEntries";
import { transactions } from "../../../Config/Database/Schema/transactions";
import { Transaction } from "../../Model/Transaction";
import { TransactionRepository } from "./TransactionRepository";
import { TransactionNotFoundException } from "../../Exception/DomainException";
import { LedgerEntry } from "../../Model/LedgerEntry";
import { LedgerEntryType } from "../../Model/Enum/LedgerEntryType";

export class DrizzleTransactionRepository implements TransactionRepository {

    public async create(transaction: Transaction): Promise<void> {
        await db.transaction(async (tx) => {
            await tx.insert(transactions).values(transaction as any);
            await tx.insert(ledgerEntries).values(transaction.getEntries() as any);
        });
    }

    public async findById(id: string): Promise<Transaction | null> {
        const rows = await db
            .select()
            .from(transactions)
            .innerJoin(ledgerEntries, eq(ledgerEntries.transactionId, transactions.id))
            .where(eq(transactions.id, id));

        if(rows.length <= 0) throw new TransactionNotFoundException(id);

        return new Transaction(
            rows.map(r => new LedgerEntry(
                r.ledger_entries.walletId,
                r.ledger_entries.counterpartyWalletId!,
                r.ledger_entries.entryType as LedgerEntryType,
                r.ledger_entries.amount,
                r.ledger_entries.balanceBefore!,
                r.ledger_entries.id,
                r.ledger_entries.createdAt
            )),
            rows[0].transactions.id,
            rows[0].transactions.description,
            rows[0].transactions.chargeId,
            rows[0].transactions.createdAt
        )
        
    }

}