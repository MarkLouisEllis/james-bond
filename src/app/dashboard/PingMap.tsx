'use client';

import dynamic from 'next/dynamic';
import type { Ping } from '@/db/schema';

const PingMapInner = dynamic(() => import('./PingMapInner'), {
  ssr: false,
  loading: () => (
    <div className="relative w-full h-[50vh] sm:h-[480px] rounded-lg border border-zinc-800 bg-zinc-900 flex items-center justify-center">
      <p className="text-zinc-500 text-sm font-mono animate-pulse">Acquiring signal…</p>
    </div>
  ),
});

export default function PingMap({ pings }: { pings: Ping[] }) {
  return <PingMapInner pings={pings} />;
}
