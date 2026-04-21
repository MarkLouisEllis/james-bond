import { Suspense } from 'react';
import Nav from '@/components/Nav';
import PingsTable from './PingsTable';
import PingsTableSkeleton from './PingsTableSkeleton';

export default function AllPingsPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Nav />
      <main className="px-4 sm:px-8 py-10">
        <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Mission Log</p>
        <h1 className="mt-1 text-2xl font-bold mb-8">All Pings</h1>
        <div className="overflow-x-auto">
          <Suspense fallback={<PingsTableSkeleton />}>
            <PingsTable />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
