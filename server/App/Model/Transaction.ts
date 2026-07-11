import { MissingTransactionLedgerEntryTypeException, UnbalancedTransactionException } from "../Exception/DomainException";
import { LedgerEntryType } from "./Enum/LedgerEntryType";
import { LedgerEntry } from "./LedgerEntry";

export class Transaction
{
    private readonly id?: string;
    private readonly amount?: number;
    private readonly fromWalletId?: string;
    private readonly toWalletId?: string;
    private readonly chargeId?: string;
    private readonly description?: string;
    private readonly createdAt?: Date;
    private readonly entries: LedgerEntry[];

    constructor(
        ledgerEntries: LedgerEntry[],
        id?: string,
        description?: string,
        chargeId?: string,
        createdAt?: Date
    ){
        this.entries = ledgerEntries;
        this.description = description;
        this.chargeId = chargeId;
        
        const { debitEntry, creditEntry, total } = this.validate();

        this.id = id;
        this.amount = total;
        this.fromWalletId = debitEntry.getWalletId();
        this.toWalletId = creditEntry.getWalletId();
        this.createdAt = createdAt;
    }

    private validate(): { debitEntry: LedgerEntry, creditEntry: LedgerEntry, total: number } 
    {
        const creditEntries = this.entries.filter(entry => entry.getType() === LedgerEntryType.CREDIT);
        const debitEntries = this.entries.filter(entry => entry.getType() === LedgerEntryType.DEBIT);

        if(creditEntries.length === 0) {
            throw new MissingTransactionLedgerEntryTypeException(LedgerEntryType.CREDIT);
        } else if (debitEntries.length === 0) {
            throw new MissingTransactionLedgerEntryTypeException(LedgerEntryType.DEBIT);
        }

        const totalCredit = creditEntries.reduce((sum, entry) => sum + entry.getAmount(), 0);
        const totalDebit = debitEntries.reduce((sum, entry) => sum + entry.getAmount(), 0);
        
        if (totalCredit !== totalDebit) {
            throw new UnbalancedTransactionException();
        }

        return { debitEntry: debitEntries[0], creditEntry: creditEntries[0], total: totalCredit };
    }

    public setEntriesTransactionId(): void
    {
        for(const entry of this.entries){
            entry.setTransactionId(this.id!);
        }
    }

    public getData(): Record<string, unknown> 
    {
        return {
            id: this.id,
            amount: this.amount,
            fromWalletId: this.fromWalletId,
            toWalletId: this.toWalletId,
            chargeId: this.chargeId,
            description: this.description,
            createdAt: this.createdAt,
            entries: this.entries

        };
    }
}