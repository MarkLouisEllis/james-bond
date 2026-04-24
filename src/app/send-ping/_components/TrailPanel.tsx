import MiniPingCard from '@/components/MiniPingCard';
import type { PingResult } from './types';

function DownArrow() {
  return (
    <div className="flex justify-center py-1">
      <svg width="12" height="20" viewBox="0 0 12 20" fill="none">
        <line
          x1="6"
          y1="0"
          x2="6"
          y2="13"
          stroke="#52525b"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <polyline
          points="2,9 6,15 10,9"
          fill="none"
          stroke="#52525b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

type Props = {
  trail: PingResult[];
  hoveredId: number | null;
  onHoverChange: (id: number | null) => void;
};

export default function TrailPanel({ trail, hoveredId, onHoverChange }: Props) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
        Latest Ping Trail
      </h2>

      {trail.length === 0 ? (
        <p className="text-sm text-zinc-500">No pings yet — send your first ping to begin.</p>
      ) : (
        <div className="flex flex-col">
          {trail.map((ping, i) => (
            <div key={ping.id}>
              <div
                onMouseEnter={() => onHoverChange(ping.id)}
                onMouseLeave={() => onHoverChange(null)}
                className={`rounded-lg transition-all duration-150 ${hoveredId === ping.id ? 'ring-1 ring-red-500/60' : ''}`}
              >
                <MiniPingCard
                  seqNum={ping.seqNum}
                  latitude={ping.latitude}
                  longitude={ping.longitude}
                  createdAt={ping.createdAt}
                  label={ping.parentId ? 'Reply' : 'Ping'}
                />
              </div>
              {i < trail.length - 1 && <DownArrow />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
