import {
  mysqlTable,
  varchar,
  int,
  timestamp,
  text,
  index,
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { charges } from './charges.js';

export const transactions = mysqlTable('transactions', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  amount: int('amount').notNull(),
  chargeId: varchar('charge_id', { length: 36 }).references(() => charges.id, { onDelete: 'restrict' }),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
},

table => [
  index('createdAt_idx').on(table.createdAt),
]);