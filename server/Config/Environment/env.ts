import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  DB_HOST: z.string().nonempty().default('127.0.0.1'),
  DB_PORT: z.coerce.number().positive().default(3306),
  DB_USER: z.string().nonempty().default('lemke-bank'),
  DB_NAME: z.string().nonempty().default('lemke-bank'),
  DB_PASSWORD: z.coerce.string().nonempty()
});

export const env = envSchema.parse(process.env);