import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { randomCoords } from '@/lib/coords';
import { getPingById, createPing } from '@/db/pings';

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, { params }: RouteContext) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const parentId = parseInt(id, 10);

  if (isNaN(parentId)) {
    return NextResponse.json({ error: 'Invalid ping id' }, { status: 400 });
  }

  const parent = await getPingById(parentId, userId);
  if (!parent) {
    return NextResponse.json({ error: 'Ping not found' }, { status: 404 });
  }

  try {
    const { latitude, longitude } = randomCoords();
    const ping = await createPing({ userId, latitude, longitude, parentId });
    return NextResponse.json(ping, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create ping' }, { status: 500 });
  }
}
