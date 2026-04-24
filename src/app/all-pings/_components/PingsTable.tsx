import { requireUserId } from '@/lib/auth';
import { listPingsForUser } from '@/db/pings';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function PingsTable() {
  const userId = await requireUserId();
  const pings = await listPingsForUser(userId);

  if (pings.length === 0) {
    return <p className="text-zinc-500 text-sm">No pings yet.</p>;
  }

  const seqByDbId = new Map(pings.map((p) => [p.id, p.seqNum]));

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/90">
      <Table>
        <TableHeader>
          <TableRow className="border-zinc-800 hover:bg-transparent">
            <TableHead className="text-zinc-400">#</TableHead>
            <TableHead className="text-zinc-400">Latitude</TableHead>
            <TableHead className="text-zinc-400">Longitude</TableHead>
            <TableHead className="text-zinc-400">Timestamp</TableHead>
            <TableHead className="text-zinc-400">Parent Ping</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pings.map((ping) => (
            <TableRow key={ping.id} className="border-zinc-800 hover:bg-zinc-900 text-zinc-300">
              <TableCell className="font-mono">{ping.seqNum}</TableCell>
              <TableCell className="font-mono">{Number(ping.latitude).toFixed(6)}</TableCell>
              <TableCell className="font-mono">{Number(ping.longitude).toFixed(6)}</TableCell>
              <TableCell>{new Date(ping.createdAt).toLocaleString()}</TableCell>
              <TableCell className="font-mono">
                {ping.parentId ? `#${seqByDbId.get(ping.parentId) ?? '?'}` : '—'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
