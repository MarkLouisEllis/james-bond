'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import MiniPingCard from '@/components/MiniPingCard';
import type { Ping } from '@/db/schema';

type PingResult = {
  id: number;
  latitude: number;
  longitude: number;
  createdAt: string;
  parentId: number | null;
};

function toPingResult(ping: Ping): PingResult {
  return {
    id: ping.id,
    latitude: Number(ping.latitude),
    longitude: Number(ping.longitude),
    createdAt: new Date(ping.createdAt).toISOString(),
    parentId: ping.parentId,
  };
}

export default function SendPingClient({ latestPing }: { latestPing: Ping | null }) {
  const [currentLatest, setCurrentLatest] = useState<PingResult | null>(
    latestPing ? toPingResult(latestPing) : null
  );
  const [replyMode, setReplyMode] = useState(false);
  const [lastParent, setLastParent] = useState<PingResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function sendPing() {
    setLoading(true);
    setError(null);

    const url = replyMode && currentLatest ? `/api/pings/${currentLatest.id}` : '/api/pings';

    try {
      const res = await fetch(url, { method: 'POST' });
      if (!res.ok) {
        setError('Failed to send ping. Please try again.');
        return;
      }
      const data: PingResult = await res.json();
      setLastParent(replyMode ? currentLatest : null);
      setCurrentLatest(data);
      setReplyMode(false);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-sm">
      <Button onClick={sendPing} disabled={loading} className="w-40 cursor-pointer">
        {loading ? 'Sending…' : replyMode ? 'Send Reply' : 'Send Ping'}
      </Button>
      {currentLatest && (
        <>
          <MiniPingCard
            id={currentLatest.id}
            latitude={currentLatest.latitude}
            longitude={currentLatest.longitude}
            createdAt={currentLatest.createdAt}
            label={currentLatest.parentId ? 'Reply' : 'Ping'}
          />
          {lastParent && (
            <>
              <div className="w-px h-6 bg-zinc-600" />
              <MiniPingCard
                id={lastParent.id}
                latitude={lastParent.latitude}
                longitude={lastParent.longitude}
                createdAt={lastParent.createdAt}
                label="Origin"
              />
            </>
          )}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <Switch checked={replyMode} onCheckedChange={setReplyMode} />
            <span className="text-sm text-zinc-300">
              Reply to Ping <span className="font-mono text-white">#{currentLatest.id}</span>
            </span>
          </label>
        </>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );
}
