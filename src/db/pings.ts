import { db } from './index';
import { pings, type Ping } from './schema';
import { desc, eq, count } from 'drizzle-orm';
import { TRAIL_LIMIT } from '@/lib/constants';

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

export async function getLatestTrailForUser(
  userId: string,
  limit = TRAIL_LIMIT
): Promise<PingWithSeq[]> {
  const [latest] = await db
    .select()
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(desc(pings.createdAt))
    .limit(1);
  if (!latest) return [];

  const trail: Ping[] = [latest];
  let current: Ping = latest;

  while (trail.length < limit && current.parentId != null) {
    const [parent] = await db.select().from(pings).where(eq(pings.id, current.parentId)).limit(1);
    if (!parent || parent.userId !== userId) break;
    trail.push(parent);
    current = parent;
  }

  const allIds = await db
    .select({ id: pings.id })
    .from(pings)
    .where(eq(pings.userId, userId))
    .orderBy(pings.id);
  const idToSeq = new Map(allIds.map((r, i) => [r.id, i + 1]));

  return trail.map((ping) => ({ ...ping, seqNum: idToSeq.get(ping.id) ?? 0 })).reverse();
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
