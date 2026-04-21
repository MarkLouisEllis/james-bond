import { requireUserId } from '@/lib/auth';
import { latestPingsForUser } from '@/db/pings';
import PingCard from '@/components/PingCard';

export default async function LatestPings() {
  const userId = await requireUserId();
  const pings = await latestPingsForUser(userId);

  if (pings.length === 0) {
    return <p className="text-zinc-500 text-sm">No pings yet.</p>;
  }

  return (
    <div className="space-y-3">
      {pings.map((ping) => (
        <PingCard key={ping.id} ping={ping} />
      ))}
    </div>
  );
}
