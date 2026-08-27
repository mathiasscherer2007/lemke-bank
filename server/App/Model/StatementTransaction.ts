import { StatementEntry } from "../Types/domain.js";

export class StatementTransaction
{
    private readonly transactionId: string;
    private readonly totalAmount: number;
    private readonly relativeAmount: number;
    private readonly description?: string | null;
    private readonly entries: StatementEntry[];
    private readonly createdAt: Date;

    constructor(
        transactionId: string, 
        totalAmount: number,
        relativeAmount: number,
        description: string | null,
        entries: StatementEntry[],
        createdAt: Date
    ) {
        this.transactionId = transactionId;
        this.totalAmount = totalAmount;
        this.relativeAmount = relativeAmount;
        this.description = description;
        this.entries = entries;
        this.createdAt = createdAt;
    }

    public getEntries(): StatementEntry[]
    {
        return this.entries;
    }

    public toPrimitives(): Record<string, unknown>
    {
        return {
            transactionId: this.transactionId,
            totalAmount: this.totalAmount,
            description: this.description,
            entries: this.entries,
            createdAt: this.createdAt
        };
    }
}