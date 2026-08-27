export interface WalletCreditRepository {
    creditWallet(
        walletId: string,
        amount: number,
        description: string,
    ): Promise<{
        transactionId: string;
        balance: number;
    }>;
}

export const WalletCreditRepository = 'WalletCreditRepository';
