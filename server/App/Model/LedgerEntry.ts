export class LedgerEntry
{
    private id: string;

    constructor(
        private transactionId: string,
        private walletId: string,
        private type: 'debit' | 'credit',
        private amount: number,
        private balanceBefore: number,
        private balanceAfter: number,
        private counterpartyWalletId: string | null,
        private createdAt: Date
    )
    {
        this.id = crypto.randomUUID();
    }

    public getWalletId(): string {
        return this.walletId;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getType(): 'debit' | 'credit' {
        return this.type;
    }

    public setTransactionId(transactionId: string): void {
        this.transactionId = transactionId;
    }
}