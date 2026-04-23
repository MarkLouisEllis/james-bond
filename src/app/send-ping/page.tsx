import Nav from '@/components/Nav';
import { requireUserId } from '@/lib/auth';
import { getLatestTrailForUser } from '@/db/pings';
import SendPingClient from './SendPingClient';

export default async function SendPingPage() {
  const userId = await requireUserId();
  const trail = await getLatestTrailForUser(userId);

  return (
    <div className="min-h-screen lg:h-screen flex flex-col bg-gray-950 text-white lg:overflow-hidden">
      <Nav />
      <main className="relative flex-1 p-6 lg:min-h-0">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
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
