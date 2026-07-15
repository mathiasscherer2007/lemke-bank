import { mysqlTable, varchar, int, timestamp, mysqlEnum } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { users } from './users.js';
import { WalletStatus } from '../../../App/Model/Enum/WalletStatus.js';

const walletStatusEnum = mysqlEnum('wallet_status', Object.values(WalletStatus) as [string, ...string[]]);

export const wallets = mysqlTable('wallets', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  userId: varchar('user_id', { length: 36 }).notNull().references(() => users.id, { onDelete: 'restrict' }),
  balance: int('balance').notNull().default(0),
  status: mysqlEnum('status', ['active', 'disabled']).notNull().default('active'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});