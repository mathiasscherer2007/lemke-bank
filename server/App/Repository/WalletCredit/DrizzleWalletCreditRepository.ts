import crypto from 'node:crypto';
import { and, eq } from 'drizzle-orm';
import { db } from '../../../Config/Database/connection.js';
import { ledgerEntries } from '../../../Config/Database/Schema/ledgerEntries.js';
import { transactions } from '../../../Config/Database/Schema/transactions.js';
import { wallets } from '../../../Config/Database/Schema/wallets.js';
import { WalletNotFoundException } from '../../Exception/DomainException.js';
import { LedgerEntryType } from '../../Model/Enum/LedgerEntryType.js';
import { WalletStatus } from '../../Model/Enum/WalletStatus.js';
import { WalletCreditRepository } from './WalletCreditRepository.js';

const MAX_MYSQL_SIGNED_INT = 2_147_483_647;

export class DrizzleWalletCreditRepository implements WalletCreditRepository {
    public async creditWallet(
        walletId: string,
        amount: number,
        description: string,
    ): Promise<{ transactionId: string; balance: number }> {
        if (!Number.isSafeInteger(amount) || amount <= 0) {
            throw new RangeError('The credit amount must be a positive integer.');
        }

        return db.transaction(async (tx) => {
            const [wallet] = await tx
                .select({
                    id: wallets.id,
                    balance: wallets.balance,
                })
                .from(wallets)
                .where(and(eq(wallets.id, walletId), eq(wallets.status, WalletStatus.ACTIVE)))
                .for('update');

            if (!wallet) {
                throw new WalletNotFoundException(walletId);
            }

            const balance = wallet.balance + amount;
            if (balance > MAX_MYSQL_SIGNED_INT) {
                throw new RangeError('The wallet balance exceeds the database limit.');
            }

            const transactionId = crypto.randomUUID();
            const now = new Date();

            await tx.insert(transactions).values({
                id: transactionId,
                amount,
                chargeId: null,
                description,
                createdAt: now,
            });

            await tx.insert(ledgerEntries).values({
                id: crypto.randomUUID(),
                transactionId,
                walletId,
                entryType: LedgerEntryType.CREDIT,
                amount,
                balanceBefore: wallet.balance,
                balanceAfter: balance,
                counterpartyWalletId: walletId,
                createdAt: now,
            });

            await tx
                .update(wallets)
                .set({ balance, updatedAt: now })
                .where(eq(wallets.id, walletId));

            return { transactionId, balance };
        });
    }
}
