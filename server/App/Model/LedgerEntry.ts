import crypto from 'node:crypto';

export class LedgerEntry
{
    private readonly id: string;
    private transactionId?: string;
    private balanceAfter?: number;
    private readonly createdAt: Date;

    constructor(
        private walletId: string,
        private type: 'debit' | 'credit',
        private readonly counterpartyWalletId: string,
        private amount: number,
        private balanceBefore: number,
    )
    {
        this.id = crypto.randomUUID();
        this.balanceAfter = this.balanceBefore + (this.type === 'credit' ? this.amount : -this.amount);
        this.createdAt = new Date();
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