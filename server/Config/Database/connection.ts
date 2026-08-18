import mysql from 'mysql2/promise';
import { drizzle } from 'drizzle-orm/mysql2';
import { env } from '../Environment/env.js';

export let pool = mysql.createPool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  timezone: 'Z',
  decimalNumbers: true,
});

export let db = drizzle(pool);

export function loadTestDatabaseConfigurations(port: number){
    pool = mysql.createPool({
        host: env.DB_HOST,
        user: env.DB_USER,
        password: env.DB_PASSWORD,
        database: env.DB_NAME,
        port: port,
        waitForConnections: true,
        connectionLimit: 10,
        timezone: 'Z',
        decimalNumbers: true
    });

    db = drizzle(pool);
}