import { Skeleton } from '@/components/ui/skeleton';

export default function PingsTableSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-10 w-full rounded bg-zinc-800" />
      {[0, 1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-12 w-full rounded bg-zinc-800/60" />
      ))}
    </div>
  );
}
