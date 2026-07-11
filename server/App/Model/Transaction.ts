import { MissingTransactionLedgerEntryTypeException, UnbalancedTransactionException } from "../Exception/DomainException";
import { LedgerEntryType } from "./Enum/LedgerEntryType";
import { LedgerEntry } from "./LedgerEntry";

export class Transaction
{
    private id?: string;
    private amount?: number;
    private fromWalletId?: string;
    private toWalletId?: string;
    private chargeId?: string;
    private description?: string;
    private createdAt?: Date;
    private readonly entries: LedgerEntry[];

    constructor(
        ledgerEntries: LedgerEntry[],
        description?: string | undefined,
        chargeId?: string
    ){
        this.entries = ledgerEntries;
        this.description = description;
        this.chargeId = chargeId;
        this.validate();
    }

    private validate(): void {
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

        this.generateTransactionData(debitEntries[0], creditEntries[0], totalCredit);
    }

    private generateTransactionData(debitEntry: LedgerEntry, creditEntry: LedgerEntry, amount: number): void {
        this.id = crypto.randomUUID();
        this.amount = amount;
        this.fromWalletId = debitEntry.getWalletId();
        this.toWalletId = creditEntry.getWalletId();
        this.createdAt = new Date();
    }

    public getData(): Record<string, unknown> {
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