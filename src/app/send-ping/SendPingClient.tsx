'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import StatusLine from './StatusLine';
import TrailPanel from './TrailPanel';
import SendPingMap from './SendPingMap';
import { TRAIL_LIMIT } from '@/lib/constants';
import { type PingResult } from './types';

export default function SendPingClient({ initialTrail }: { initialTrail: PingResult[] }) {
  const [trail, setTrail] = useState<PingResult[]>(initialTrail);
  const [replyMode, setReplyMode] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [pinging, setPinging] = useState(false);
  const [switchSonar, setSwitchSonar] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const currentLatest = trail.at(-1) ?? null;
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  function handleSendClick() {
    if (!replyMode && trail.length >= 2) {
      setShowWarning(true);
      return;
    }
    sendPing();
  }

  function handleSwitchChange(checked: boolean) {
    setReplyMode(checked);
    setSwitchSonar(true);
    setTimeout(() => setSwitchSonar(false), 1000);
  }

  async function sendPing() {
    setPinging(true);
    setTimeout(() => setPinging(false), 1000);

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
      if (replyMode) {
        setTrail((prev) => [...prev, data].slice(-TRAIL_LIMIT));
      } else {
        setTrail([data]);
      }
      setReplyMode(false);
      setConfirmed(true);
      setTimeout(() => setConfirmed(false), 3000);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-24 lg:h-full">
      {/* Left panel */}
      <div className="flex flex-col gap-4">
        {/* Map bordered container*/}
        <div className="rounded-xl border border-zinc-700 overflow-hidden">
          <div className="px-4 py-3 border-b border-zinc-800 flex justify-center">
            <StatusLine loading={loading} confirmed={confirmed} />
          </div>
          <SendPingMap pings={trail} hoveredId={hoveredId} onHoverChange={setHoveredId} />
        </div>

        <div className="flex items-center justify-between">
          {/* Radar rings */}
          <div className="relative flex items-center justify-center p-5 overflow-hidden">
            <span
              className="absolute w-24 h-24 rounded-full border border-emerald-500/15 animate-ping pointer-events-none"
              style={{ animationDuration: '3s' }}
            />
            <span
              className="absolute w-40 h-40 rounded-full border border-emerald-500/[0.07] animate-ping pointer-events-none"
              style={{ animationDuration: '4.5s', animationDelay: '1s' }}
            />
            <div className="relative z-10 inline-flex">
              <Button onClick={handleSendClick} disabled={loading} className="w-40 cursor-pointer">
                {loading ? 'Sending…' : replyMode ? 'Send Reply' : 'Send Ping'}
              </Button>
              {pinging && (
                <span className="absolute inset-0 rounded-md animate-ping bg-emerald-400/25 pointer-events-none" />
              )}
            </div>
          </div>

          {currentLatest && (
            <label className="flex items-center gap-3 cursor-pointer select-none pr-2">
              <div className="relative inline-flex items-center justify-center">
                <Switch checked={replyMode} onCheckedChange={handleSwitchChange} />
                {switchSonar && (
                  <span className="absolute w-10 h-10 rounded-full border-2 border-emerald-400/60 animate-ping pointer-events-none" />
                )}
              </div>
              <span className="flex flex-col gap-0.5">
                <span className="text-sm text-zinc-300">
                  Continue Mission{' '}
                  <span className="font-mono text-white">· Ping #{currentLatest.seqNum}</span>
                </span>
                <span className="text-xs text-zinc-500">Extend the operation trail</span>
              </span>
            </label>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>

      {/* Trail termination warning */}
      <AlertDialog open={showWarning} onOpenChange={setShowWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Terminate current trail?</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to terminate the current trail. A new ping will start a fresh mission.
              Do you want to proceed?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowWarning(false);
                sendPing();
              }}
            >
              Proceed
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Right panel */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 mt-8 lg:mt-0 lg:overflow-y-auto lg:min-h-0">
        <TrailPanel trail={trail} hoveredId={hoveredId} onHoverChange={setHoveredId} />
      </div>
    </div>
  );
}
