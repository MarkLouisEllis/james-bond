import { NextResponse } from 'next/server';
import { requireUserId } from '@/lib/auth';
import { latestPingsForUser } from '@/db/pings';

export async function GET(_req: Request) {
  let userId: string;
  try {
    userId = await requireUserId();
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pings = await latestPingsForUser(userId);
    return NextResponse.json(pings);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch pings' }, { status: 500 });
  }
}
