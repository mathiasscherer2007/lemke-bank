export type StatementEntry = {
    id: string;
    counterpartyWalletId: string;
    amount: number;
    type: LedgerEntryType;
    balanceBefore: number;
    balanceAfter: number;
    createdAt: Date;
    relatedUser: {
        id: string;
        username: string;
    };
}

export type DateStatementGroup = {
    date: string;
    closingBalance: number;
    transactions: StatementTransaction[];
}