import { requireUserId } from '@/lib/auth';
import { latestPingsForUser } from '@/db/pings';
import PingMap from './PingMap';

export default async function LatestPings() {
  const userId = await requireUserId();
  const pings = await latestPingsForUser(userId);

  if (pings.length === 0) {
    return (
      <p className="text-zinc-500 text-sm">
        No pings yet. Send your first ping to begin the mission.
      </p>
    );
  }

  return <PingMap pings={pings} />;
}
