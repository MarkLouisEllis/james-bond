export default function StatusLine({
  loading,
  confirmed,
}: {
  loading: boolean;
  confirmed: boolean;
}) {
  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
        Transmitting
      </div>
    );
  }
  if (confirmed) {
    return (
      <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-emerald-500 uppercase">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Ping Confirmed
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-500" />
      Standby
    </div>
  );
}
