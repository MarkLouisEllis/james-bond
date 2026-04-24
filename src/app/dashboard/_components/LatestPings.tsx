import { requireUserId } from '@/lib/auth';
import { latestPingsForUser } from '@/db/pings';
import PingMap from './PingMap';

export default async function LatestPings() {
  const userId = await requireUserId();
  const pings = await latestPingsForUser(userId);

  return <PingMap pings={pings} />;
}
