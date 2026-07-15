import { mysqlTable, varchar, int, timestamp, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { transactions } from './transactions.js';
import { wallets } from './wallets.js';
import { LedgerEntryType } from '../../../App/Model/Enum/LedgerEntryType.js';

const entryTypeEnum = mysqlEnum('entry_type', Object.values(LedgerEntryType) as [string, ...string[]]);

export const ledgerEntries = mysqlTable('ledger_entries', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  transactionId: varchar('transaction_id', { length: 36 }).notNull().references(() => transactions.id, { onDelete: 'restrict' }),
  walletId: varchar('wallet_id', { length: 36 }).notNull().references(() => wallets.id, { onDelete: 'restrict' }),
  entryType: entryTypeEnum.notNull(),
  amount: int('amount').notNull(),
  balanceBefore: int('balance_before'),
  balanceAfter: int('balance_after'),
  counterpartyWalletId: varchar('counterparty_wallet_id', { length: 36 }).references(() => wallets.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, 
// Indexes
table => [
  index('wallet_idx').on(table.walletId),
  index('transaction_idx').on(table.transactionId)
]);