import { mysqlTable, varchar, decimal, timestamp, text, mysqlEnum, uniqueIndex } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { wallets } from './wallets';
import { transactions } from './transactions';

export const charges = mysqlTable('charges', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  issuerWalletId: varchar('issuer_wallet_id').notNull().references(() => wallets.id, { onDelete: 'restrict' }),
  amount: decimal('amount', { precision: 19, scale: 8 }).notNull(),
  description: text('description'),
  status: mysqlEnum('status', ['open', 'paid', 'expired']).notNull().default('open'),
  expiresAt: timestamp('expires_at'),
  payerWalletId: varchar('payer_wallet_id', { length: 36 }).references(() => wallets.id, { onDelete: 'restrict' }),
  paymentTransactionId: varchar('payment_transaction_id', { length: 36 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  paidAt: timestamp('paid_at'),
});