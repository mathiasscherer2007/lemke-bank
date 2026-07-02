import { mysqlTable, varchar, decimal, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { users } from './users';

export const wallets = mysqlTable('wallets', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'restrict' }),
  accountId: varchar('account_id', { length: 64 }).notNull(),
  currency: varchar('currency', { length: 3 }).notNull(),
  balance: decimal('balance', { precision: 19, scale: 8 }).notNull().default('0'),
  status: mysqlEnum('status', ['active', 'disabled', 'closed']).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});