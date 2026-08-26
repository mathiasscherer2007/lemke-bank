import crypto from 'node:crypto';
import { LedgerEntryType } from './Enum/LedgerEntryType.js';

export class LedgerEntry
{
    private readonly entryType: LedgerEntryType;
    private transactionId?: string;
    private readonly amount: number;
    private readonly balanceBefore?: number;
    private readonly balanceAfter?: number;
    private readonly id?: string;
    private readonly walletId: string;
    private readonly counterpartyWalletId: string;
    private readonly createdAt?: Date;

    constructor(
        walletId: string,
        counterpartyWalletId: string,
        entryType: LedgerEntryType,
        amount: number,
        balanceBefore?: number,
        balanceAfter?: number,
        id?: string,
        createdAt?: Date
    )
    {
        this.id = id ?? crypto.randomUUID();
        this.walletId = walletId;
        this.entryType = entryType;
        this.counterpartyWalletId = counterpartyWalletId;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter ?? balanceBefore! + (entryType === LedgerEntryType.CREDIT ? amount : -amount);
        this.createdAt = createdAt;
        this.transactionId = this.transactionId;
    }

    public getWalletId(): string {
        return this.walletId;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getType(): LedgerEntryType {
        return this.entryType;
    }

    public getCounterpartyWalletId(): string {
        return this.counterpartyWalletId;
    }

    public setTransactionId(transactionId: string): void {
        this.transactionId = transactionId;
    }

    public toPrimitives(): Record<string, unknown>
    {
        return {
            ...this as Record<string, unknown>
        }
    }
}