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
      <main className="px-4 sm:px-8 py-10 max-w-2xl">
        <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Mission Control</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome back, {name}.</h1>

        <section className="mt-10">
          <h2 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4">
            Latest Pings
          </h2>
          <Suspense fallback={<LatestPingsSkeleton />}>
            <LatestPings />
          </Suspense>
        </section>

        <div className="mt-8 flex gap-4">
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
      </main>
    </div>
  );
}
