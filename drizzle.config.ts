import type { Config } from 'drizzle-kit';

try {
  process.loadEnvFile('.env.local');
} catch {
  // .env.local absent in CI — env vars injected directly
}

export default {
  schema: './src/db/schema.ts',
  out: './src/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DIRECT_URL!,
  },
} satisfies Config;
