import { mysqlTable, varchar, timestamp, mysqlEnum, uniqueIndex,  } from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm';
import { UserStatus } from '../../Model/Enum/UserStatus.js';

const userStatusEnum = mysqlEnum('status', Object.values(UserStatus) as [string, ...string[]]);

export const users = mysqlTable('users', {
  id: varchar('id', { length: 36 }).primaryKey().default(sql`(UUID())`),
  email: varchar('email', { length: 320 }).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  username: varchar('username', { length: 128 }).notNull(),
  status: userStatusEnum.notNull().default('active'),
  role: mysqlEnum('role', ['user', 'admin']).notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
// Indexes
 table => [
  uniqueIndex('users_email_idx').on(table.email),
  uniqueIndex('status_idx').on(table.status),
  sql`CREATE FULLTEXT INDEX search_idx on ${table} (${table.username}, ${table.email})`,
]);
