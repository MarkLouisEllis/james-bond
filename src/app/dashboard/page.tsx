import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import Link from 'next/link';
import Nav from '@/components/Nav';
import LatestPings from './LatestPings';
import LatestPingsSkeleton from './LatestPingsSkeleton';

export default async function DashboardPage() {
  const user = await currentUser();
  const name = user?.firstName ?? 'Agent';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Nav />

      <div className="px-4 sm:px-8 pt-10 pb-4">
        <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Mission Control</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome back, {name}.</h1>
      </div>

      {/* Map — full width, constrained only by page padding */}
      <div className="px-4 sm:px-8">
        <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          Latest Pings
        </p>
        <Suspense fallback={<LatestPingsSkeleton />}>
          <LatestPings />
        </Suspense>
      </div>

      <div className="px-4 sm:px-8 mt-8 pb-10 flex gap-4">
        <Link
          href="/send-ping"
          className="text-sm bg-white text-black px-4 py-2 rounded font-medium hover:bg-zinc-200 transition"
        >
          Send Ping
        </Link>
        <Link
          href="/all-pings"
          className="text-sm border border-zinc-600 px-4 py-2 rounded text-zinc-300 hover:border-zinc-400 transition"
        >
          All Pings
        </Link>
      </div>
    </div>
  );
}
