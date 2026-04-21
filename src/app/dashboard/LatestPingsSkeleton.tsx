import { Skeleton } from '@/components/ui/skeleton';

export default function LatestPingsSkeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <Skeleton key={i} className="h-20 w-full rounded-lg bg-zinc-800" />
      ))}
    </div>
  );
}
