import Nav from '@/components/Nav';
import { requireUserId } from '@/lib/auth';
import { getLatestPingForUser } from '@/db/pings';
import SendPingClient from './SendPingClient';

export default async function SendPingPage() {
  const userId = await requireUserId();
  const latestPing = await getLatestPingForUser(userId);

  return (
    <>
      <Nav />
      <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center gap-8 p-6">
        <h1 className="text-3xl font-bold tracking-tight">Send Ping</h1>
        <SendPingClient latestPing={latestPing} />
      </main>
    </>
  );
}
