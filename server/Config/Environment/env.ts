import { z } from 'zod';

const envSchema = z.object({
  DB_HOST: z.string().nonempty().default('127.0.0.1'),
  DB_PORT: z.coerce.number().positive().default(3306),
  DB_USER: z.string().nonempty().default('lemke-bank'),
  DB_NAME: z.string().nonempty().default('lemke-bank'),
  DB_PASSWORD: z.coerce.string().optional(),
  API_HOST: z.coerce.string().default('Lemke-Bank-API'),
  API_PORT: z.coerce.number().default(3000),
  HOLIDAYS_API_URL: z.coerce.string().optional(),
  API_SECRET: z.coerce.string().optional(),
  REDIS_HOST: z.string().nonempty().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().positive().default(6379),
  REDIS_PASSWORD: z.coerce.string().optional(),
});

export const env = envSchema.parse(process.env);