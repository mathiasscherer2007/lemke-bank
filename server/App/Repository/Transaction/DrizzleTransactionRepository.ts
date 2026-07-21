import { asc, eq, inArray } from "drizzle-orm";
import { db } from "../../../Config/Database/connection.js";
import { ledgerEntries } from "../../../Config/Database/Schema/ledgerEntries.js";
import { transactions } from "../../../Config/Database/Schema/transactions.js";
import { Transaction } from "../../Model/Transaction.js";
import { TransactionRepository } from "./TransactionRepository.js";
import { TransactionNotFoundException } from "../../Exception/DomainException.js";
import { LedgerEntry } from "../../Model/LedgerEntry.js";
import { LedgerEntryType } from "../../Model/Enum/LedgerEntryType.js";
import { wallets } from "../../../Config/Database/Schema/wallets.js";

export class DrizzleTransactionRepository implements TransactionRepository {

    public async create(transaction: Transaction): Promise<void> {
        await db.transaction(async (tx) => {
            const entries = transaction.getEntries();
            const walletIds = [...new Set(entries.map(entry => entry.getWalletId()))].sort();
            const lockedWallets = await tx
                .select()
                .from(wallets)
                .where(inArray(wallets.id, walletIds))
                .orderBy(asc(wallets.id))
                .for("update");

            const balances = new Map(lockedWallets.map(wallet => [wallet.id, wallet.balance]));
            for (const entry of entries) {
                const balance = balances.get(entry.getWalletId())!;
                balances.set(
                    entry.getWalletId(),
                    balance + (entry.getType() === LedgerEntryType.CREDIT ? entry.getAmount() : -entry.getAmount())
                );
            }

            await tx.insert(transactions).values(transaction as any);
            await tx.insert(ledgerEntries).values(entries as any);

            await Promise.all([...balances].map(([walletId, balance]) =>
                tx.update(wallets)
                    .set({
                        balance,
                    })
                    .where(eq(wallets.id, walletId))
            ));
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
                r.ledger_entries.balanceAfter!,
                r.ledger_entries.id,
                r.ledger_entries.createdAt
            )),
            rows[0].transactions.description,
            rows[0].transactions.chargeId,
            rows[0].transactions.id,
            rows[0].transactions.createdAt
        )
        
    }

}
