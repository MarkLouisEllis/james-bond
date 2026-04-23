import Image from 'next/image';
import type { PingResult } from './types';

function toXY(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 50;
  return [x, y];
}

export default function SendPingMap({ pings }: { pings: PingResult[] }) {
  return (
    <div className="relative w-full overflow-hidden">
      <Image
        src="/map.jpg"
        alt="World map"
        width={1200}
        height={600}
        className="w-full h-auto block"
      />

      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 50"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="dot-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="0.9" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {pings.length > 1 && (
          <polyline
            points={pings.map((p) => toXY(p.latitude, p.longitude).join(',')).join(' ')}
            fill="none"
            stroke="#ef4444"
            strokeWidth="0.35"
            strokeOpacity="0.5"
          />
        )}
        {pings.map((ping) => {
          const [x, y] = toXY(ping.latitude, ping.longitude);
          return (
            <g key={ping.id} filter="url(#dot-glow)">
              <circle cx={x} cy={y} r="1.4" fill="#ef4444" fillOpacity="0.25" />
              <circle cx={x} cy={y} r="0.7" fill="#ef4444" stroke="white" strokeWidth="0.15" />
            </g>
          );
        })}
      </svg>

      {pings.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-zinc-400 text-xs font-mono tracking-widest">AWAITING FIRST PING</p>
        </div>
      )}
    </div>
  );
}
