import type { Ping } from '@/db/schema';

export default function PingCard({ ping }: { ping: Ping }) {
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-1">
      <p className="text-xs text-gray-400 uppercase tracking-widest">Ping #{ping.id}</p>
      <p className="font-mono text-white">
        {Number(ping.latitude).toFixed(6)}, {Number(ping.longitude).toFixed(6)}
      </p>
      <p className="text-xs text-gray-500">{new Date(ping.createdAt).toLocaleString()}</p>
    </div>
  );
}
