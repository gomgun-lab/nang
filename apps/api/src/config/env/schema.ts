import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  API_PREFIX: z.string(),
  DATABASE_URL: z.url(),
});

type Env = z.infer<typeof envSchema>;

export type { Env };
export { envSchema };
