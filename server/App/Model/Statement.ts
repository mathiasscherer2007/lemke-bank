import { DateStatementGroup } from "../Types/domain.js";
import { StatementTransaction } from "./StatementTransaction.js";

class Statement
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

    public getDateClosingBalance(date: Date): number
    {
        const dateKey = date.toISOString().split('T')[0];
        const transactionsOnDate = this.groupTransactionsByDate().get(dateKey);

        if(!transactionsOnDate || transactionsOnDate.length === 0)
        {
            return this.getOpeningBalance();
        }

        const lastTransaction = transactionsOnDate[transactionsOnDate.length - 1];
        const lastEntry = lastTransaction.getEntries()[lastTransaction.getEntries().length - 1];

        return lastEntry.balanceBefore + lastEntry.amount;
    }

    private groupTransactionsByDate(transactions: StatementTransaction[]): Map<string, StatementTransaction[]>
    {
        const groupedTransactions = new Map<string, StatementTransaction[]>();

        for(const transaction of transactions)
        {
            const dateKey = transaction.getEntries()[0].createdAt.toLocaleDateString("pt-br");

            if(!groupedTransactions.has(dateKey))
            {
                groupedTransactions.set(dateKey, []);
            }

            groupedTransactions.get(dateKey)!.push(transaction);
        }

        return groupedTransactions;
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
    //         
            }

            groupedTransactions.get(dateKey)!.transactions.push(transaction);
        }

        return groupedTransactions;




        return this.groupTransactionsByDate(this.transactions);
    }
}