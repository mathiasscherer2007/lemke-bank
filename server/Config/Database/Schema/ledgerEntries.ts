import { mysqlTable, varchar, int, timestamp, mysqlEnum, index } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { transactions } from './transactions';
import { wallets } from './wallets';

export const ledgerEntries = mysqlTable('ledger_entries', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  transactionId: varchar('transaction_id', { length: 36 }).notNull().references(() => transactions.id, { onDelete: 'restrict' }),
  walletId: varchar('wallet_id', { length: 36 }).notNull().references(() => wallets.id, { onDelete: 'restrict' }),
  entryType: mysqlEnum('entry_type', ['debit', 'credit']).notNull(),
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