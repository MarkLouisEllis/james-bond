import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { randomCoords } from '@/lib/coords';
import { createPing, listPingsForUser } from '@/db/pings';

export async function GET(_req: Request) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pings = await listPingsForUser(userId);
    return NextResponse.json(pings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pings' }, { status: 500 });
  }
}

export async function POST(_req: Request) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { latitude, longitude } = randomCoords();
    const ping = await createPing({ userId, latitude, longitude });
    return NextResponse.json(ping, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create ping' }, { status: 500 });
  }
}
