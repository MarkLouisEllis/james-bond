import { db } from './index';
import { pings, type Ping } from './schema';
import { desc, eq, count } from 'drizzle-orm';

export type PingWithSeq = Ping & { seqNum: number };

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
}): Promise<PingWithSeq> {
  const [ping] = await db
    .insert(pings)
    .values({ userId, latitude, longitude, parentId: parentId ?? null })
    .returning();
  const [{ total }] = await db
    .select({ total: count() })
    .from(pings)
    .where(eq(pings.userId, userId));
  return { ...ping, seqNum: total };
}

export async function latestPingsForUser(userId: string, limit = 3): Promise<PingWithSeq[]> {
  const [{ total }] = await db
    .select({ total: count() })
    .from(pings)
    .where(eq(pings.userId, userId));
  const rows = await db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt))
    .limit(limit);
  return rows.map((ping, i) => ({ ...ping, seqNum: total - i }));
}

export async function listPingsForUser(userId: string): Promise<PingWithSeq[]> {
  const rows = await db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt));
  return rows.map((ping, i) => ({ ...ping, seqNum: rows.length - i }));
}

export async function getPingById(id: number, userId: string): Promise<Ping | null> {
  const [ping] = await db.select().from(pings).where(eq(pings.id, id)).limit(1);
  if (!ping || ping.userId !== userId) return null;
  return ping;
}

export async function getLatestPingForUser(userId: string): Promise<PingWithSeq | null> {
  const [ping] = await db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt))
    .limit(1);
  if (!ping) return null;
  const [{ total }] = await db
    .select({ total: count() })
    .from(pings)
    .where(eq(pings.userId, userId));
  return { ...ping, seqNum: total };
}
