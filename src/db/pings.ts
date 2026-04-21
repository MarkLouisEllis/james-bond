import { db } from './index';
import { pings, type Ping } from './schema';
import { desc, eq } from 'drizzle-orm';

export async function createPing({
  userId,
  latitude,
  longitude,
  parentId,
}: {
  userId: string;
  latitude: number;
  longitude: number;
  parentId?: number | null;
}): Promise<Ping> {
  const [ping] = await db
    .insert(pings)
    .values({ userId, latitude, longitude, parentId: parentId ?? null })
    .returning();
  return ping;
}

export async function latestPingsForUser(userId: string, limit = 3): Promise<Ping[]> {
  return db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt))
    .limit(limit);
}

export async function listPingsForUser(userId: string): Promise<Ping[]> {
  return db.select().from(pings).where(eq(pings.userId, userId)).orderBy(desc(pings.createdAt));
}

export async function getPingById(id: number, userId: string): Promise<Ping | null> {
  const [ping] = await db.select().from(pings).where(eq(pings.id, id)).limit(1);
  if (!ping || ping.userId !== userId) return null;
  return ping;
}

export async function getLatestPingForUser(userId: string): Promise<Ping | null> {
  const [ping] = await db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt))
    .limit(1);
  return ping ?? null;
}
