import { and, eq, or, sql } from "drizzle-orm"
import { db } from "../../../Config/Database/connection.js"
import { wallets } from "../../../Config/Database/Schema/wallets.js"
import { Wallet } from "../../Model/Wallet.js"
import { WalletStatus } from "../../Model/Enum/WalletStatus.js";
import { WalletRepository } from "./WalletRepository.js";
import { LedgerEntry } from "../../Model/LedgerEntry.js";
import { ledgerEntries } from "../../../Config/Database/Schema/ledgerEntries.js";
import { LedgerEntryType } from "../../Model/Enum/LedgerEntryType.js";

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

    public async findEntries(id: string, month: number, year: number): Promise<LedgerEntry[]>
    {
        const rows = await db.select()
            .from(ledgerEntries)
            .where(
                and(
                    or(
                        eq(ledgerEntries.walletId, id), 
                        eq(ledgerEntries.counterpartyWalletId, id)
                    ), 
                    eq(sql<number>`EXTRACT(MONTH FROM ${ledgerEntries.createdAt})`, month),
                    eq(sql<number>`EXTRACT(YEAR FROM ${ledgerEntries.createdAt})`, year)
                )
            )

        const entries = [];

        for (const row of rows){
            entries.push(new LedgerEntry(
                row.walletId,
                row.counterpartyWalletId!,
                row.entryType as LedgerEntryType,
                row.amount,
                row.balanceBefore!,
                row.balanceAfter!,
                row.id!,
                row.createdAt
            ))
        }

        return entries;
    }
}