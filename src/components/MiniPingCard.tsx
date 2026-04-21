type Props = {
  id: number;
  latitude: number;
  longitude: number;
  createdAt: string | Date;
  label: string;
};

export default function MiniPingCard({ id, latitude, longitude, createdAt, label }: Props) {
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg p-4 space-y-1 w-full">
      <p className="text-xs text-zinc-500 uppercase tracking-widest font-mono">
        {label} #{id}
      </p>
      <p className="font-mono text-white">
        {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
      </p>
      <p className="text-xs text-zinc-500">{new Date(createdAt).toLocaleString()}</p>
    </div>
  );
}
