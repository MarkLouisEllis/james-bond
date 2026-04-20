import { currentUser } from '@clerk/nextjs/server';
import Nav from '@/components/Nav';

export default async function DashboardPage() {
  const user = await currentUser();
  const name = user?.firstName ?? 'Agent';

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Nav />
      <main className="px-8 py-10">
        <p className="text-xs font-mono tracking-widest text-zinc-500 uppercase">Mission Control</p>
        <h1 className="mt-1 text-2xl font-bold">Welcome back, {name}.</h1>
      </main>
    </div>
  );
}
