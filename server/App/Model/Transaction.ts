import { LedgerEntry } from "./LedgerEntry";

export class Transaction
{
    private id?: string;
    private amount?: number;
    private fromWalletId?: string;
    private toWalletId?: string;
    private chargeId: string | null;
    private description: string | null;
    private createdAt?: Date;
    private readonly entries: LedgerEntry[];

    constructor(
        ledgerEntries: LedgerEntry[],
        description: string | null = null,
        chargeId: string | null = null
    ){
        this.entries = ledgerEntries;
        this.description = description;
        this.chargeId = chargeId;
        this.validate();
    }

    private validate(): void {
        const creditEntries = this.entries.filter(entry => entry.getType() === 'credit');
        const debitEntries = this.entries.filter(entry => entry.getType() === 'debit');

        if(creditEntries.length === 0 || debitEntries.length === 0) {
            throw new Error('Transaction must have at least one credit and one debit entry.');   
        }

        const totalCredit = creditEntries.reduce((sum, entry) => sum + entry.getAmount(), 0);
        const totalDebit = debitEntries.reduce((sum, entry) => sum + entry.getAmount(), 0);
        
        if (totalCredit !== totalDebit) {
            // TODO: Change generic error for a speciific domain error.
            throw new Error('Transaction is not balanced: total credit does not equal total debit.');
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
}