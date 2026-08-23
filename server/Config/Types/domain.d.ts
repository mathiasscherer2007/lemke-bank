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

export type SearchedUser = {
    id: string;
    email: string;
    username: string;
    walletId: string;
    createdAt: Date;
    updatedAt: Date;
}