import { StatementEntry } from "../Types/domain.js";

export class StatementTransaction
{
    private readonly transactionId: string;
    private readonly totalAmount: number;
    private readonly description?: string | null;
    private readonly entries: StatementEntry[];
    private readonly createdAt: Date;

    constructor(
        transactionId: string, 
        totalAmount: number,
        description: string | null,
        entries: StatementEntry[],
        createdAt: Date
    ) {
        this.transactionId = transactionId;
        this.totalAmount = totalAmount;
        this.description = description;
        this.entries = entries;
        this.createdAt = createdAt;
    }

    public getEntries(): StatementEntry[]
    {
        return this.entries;
    }
}