import { DateStatementGroup } from "../Types/domain.js";
import { StatementTransaction } from "./StatementTransaction.js";

export class Statement
{
    private readonly walletId: string;
    private readonly transactions: StatementTransaction[];

    constructor(
        walletId: string,
        transactions: StatementTransaction[]    
    ){
        this.walletId = walletId;
        this.transactions = transactions
    }

    public getOpeningBalance(): number
    {
        if(this.transactions.length === 0)
        {
            return 0;
        }

        const firstTransaction = this.transactions[0];
        const firstEntry = firstTransaction.getEntries().at(-1);

        return firstEntry!.balanceBefore;
    }

    public groupByDate(transactions: StatementTransaction[]): DateStatementGroup[]
    {
        const groupedTransactions = new Map<string, DateStatementGroup>();

        for(const transaction of transactions)
        {
            const dateKey = transaction.getEntries()[0].createdAt.toLocaleDateString("pt-br");

            if(!groupedTransactions.has(dateKey))
            {
                groupedTransactions.set(dateKey, { date: dateKey, closingBalance: 0, transactions: [] });  
            }

            const group = groupedTransactions.get(dateKey)!;
            group.transactions.push(transaction);
            
            // Update closing balance as we add transactions
            const lastEntry = transaction.getEntries().at(-1);
            group.closingBalance = lastEntry!.balanceAfter
        }

        return Array.from(groupedTransactions.values());
    }


}