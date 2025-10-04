import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  API_PREFIX: z.string(),
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('1h'),
});

type Env = z.infer<typeof envSchema>;

export type { Env };
export { envSchema };
