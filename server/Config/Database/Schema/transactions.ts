import {
  mysqlTable,
  varchar,
  decimal,
  timestamp,
  text,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { wallets } from './wallets';
import { charges } from './charges';

export const transactions = mysqlTable('transactions', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  amount: decimal('amount', { precision: 19, scale: 8 }).notNull(),
  fromWalletId: varchar('from_wallet_id', { length: 36 }).notNull().references(() => wallets.id, { onDelete: 'restrict' }),
  toWalletId: varchar('to_wallet_id', { length: 36 }).notNull().references(() => wallets.id, { onDelete: 'restrict' }),
  chargeId: varchar('charge_id', { length: 36 }).references(() => charges.id, { onDelete: 'restrict' }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});