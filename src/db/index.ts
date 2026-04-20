import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

declare global {
  var __pgClient: postgres.Sql | undefined;
}

const client =
  globalThis.__pgClient ??
  postgres(process.env.DATABASE_URL!, {
    max: 1,
    idle_timeout: 20,
    max_lifetime: 1800,
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.__pgClient = client;
}

export const db = drizzle(client, { schema });
