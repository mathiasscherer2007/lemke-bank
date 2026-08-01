import { and, eq, inArray, or, sql } from "drizzle-orm"
import { db } from "../../../Config/Database/connection.js"
import { wallets } from "../../../Config/Database/Schema/wallets.js"
import { Wallet } from "../../Model/Wallet.js"
import { WalletStatus } from "../../Model/Enum/WalletStatus.js";
import { WalletRepository } from "./WalletRepository.js";
import { LedgerEntry } from "../../Model/LedgerEntry.js";
import { LedgerEntryType } from "../../Model/Enum/LedgerEntryType.js";
import { transactions } from "../../../Config/Database/Schema/transactions.js";
import { Transaction } from "../../Model/Transaction.js";
import { ledgerEntries } from "../../../Config/Database/Schema/ledgerEntries.js";

export class DrizzleWalletRepository implements WalletRepository
{
    public async create(wallet: Wallet): Promise<void>
    {
        await db.insert(wallets).values(wallet.toPrimitives() as any);
    }
    
    public async findById(id: string): Promise<Wallet | null>
    {
        const [ row ] = await db.select().from(wallets).where(eq(wallets.id, id)).limit(1);

        if(!row) return null;

        return new Wallet(
            row.userId, 
            row.status as WalletStatus, 
            row.balance, 
            row.id, 
            row.createdAt, 
            row.updatedAt
        );
    }

    public async findByUserId(userId: string): Promise<Wallet | null>
    {
        const [ row ] = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);

        if(!row) return null;

        return new Wallet(
            row.userId, 
            row.status as WalletStatus, 
            row.balance, 
            row.id, 
            row.createdAt, 
            row.updatedAt
        );
    }

    public async findEntries(id: string, month: number, year: number): Promise<Transaction[]>
    {
        const transactionsRows = await db
            .select()
            .from(transactions)
            .where(
                and(
                    or(
                        eq(transactions.fromWalletId, id), 
                        eq(transactions.toWalletId, id)
                    ), 
                    eq(sql<number>`EXTRACT(MONTH FROM ${transactions.createdAt})`, month),
                    eq(sql<number>`EXTRACT(YEAR FROM ${transactions.createdAt})`, year)
                )
            )

        const transactionsIds = transactionsRows.map(row => row.id);

        const entriesRows = await db
            .select()
            .from(ledgerEntries)
            .where(inArray(ledgerEntries.transactionId, transactionsIds));

        const entriesByTransaction = new Map<string, LedgerEntry[]>();
        for (const entry of entriesRows) {
            if (!entriesByTransaction.has(entry.transactionId)) {
                entriesByTransaction.set(entry.transactionId, []);
            }

            entriesByTransaction.get(entry.transactionId)!.push(new LedgerEntry(
                entry.walletId,
                entry.counterpartyWalletId!,
                entry.entryType as LedgerEntryType,
                entry.amount,
                entry.balanceBefore!,
                entry.balanceAfter!,
                entry.id,
                entry.createdAt
            ));
        }

        const entries: Transaction[] = [];

        for (const row of transactionsRows) {
            entries.push(new Transaction(
                entriesByTransaction.get(row.id) || [],
                row.description,
                row.chargeId,
                row.id,
                row.createdAt
            ));
        }

        return entries;
    }
}