import Nav from '@/components/Nav';
import { requireUserId } from '@/lib/auth';
import { getLatestTrailForUser } from '@/db/pings';
import SendPingClient from './SendPingClient';

export default async function SendPingPage() {
  const userId = await requireUserId();
  const trail = await getLatestTrailForUser(userId);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col lg:overflow-hidden">
      <Nav />
      <main className="relative flex-1 p-6 lg:min-h-0">
        <div className="relative z-10 max-w-8xl mx-auto lg:h-full">
          <SendPingClient
            initialTrail={trail.map((p) => ({
              id: p.id,
              seqNum: p.seqNum,
              latitude: Number(p.latitude),
              longitude: Number(p.longitude),
              createdAt: new Date(p.createdAt).toISOString(),
              parentId: p.parentId,
            }))}
          />
        </div>
      </main>
    </div>
  );
}
