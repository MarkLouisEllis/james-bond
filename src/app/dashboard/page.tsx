import { Suspense } from 'react';
import { currentUser } from '@clerk/nextjs/server';
import Nav from '@/components/Nav';
import LatestPings from './_components/LatestPings';
import LatestPingsSkeleton from './_components/LatestPingsSkeleton';

export default async function DashboardPage() {
  const user = await currentUser();
  const name = user?.firstName ?? 'Agent';

  return (
    <div className="min-h-screen">
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
    </div>
  );
}
