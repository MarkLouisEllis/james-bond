import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      <div className="mb-2 text-xs font-mono tracking-widest text-zinc-500 uppercase">
        Classified — Eyes Only
      </div>

      <h1 className="mt-4 text-5xl font-bold tracking-tight text-white">Ping Mission</h1>

      <p className="mt-4 max-w-sm text-zinc-400">
        Send encrypted location pings. Reply to form a trail. All transmissions are agent-scoped and
        secured.
      </p>

      <div className="mt-10 flex gap-4">
        <Link
          href="/sign-in"
          className="rounded-lg bg-zinc-100 px-6 py-2.5 text-sm font-semibold text-zinc-900 transition hover:bg-white"
        >
          Sign In
        </Link>
        <Link
          href="/sign-up"
          className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-500 hover:text-white"
        >
          Create Account
        </Link>
      </div>
    </main>
  );
}
