import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function HomePage() {
  const { userId } = await auth();

  if (userId) {
    redirect('/dashboard');
  }

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      {/* Radar pulse rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span
          className="absolute w-64 h-64 rounded-full border border-emerald-500/10 animate-ping"
          style={{ animationDuration: '3s' }}
        />
        <span
          className="absolute w-96 h-96 rounded-full border border-emerald-500/5 animate-ping"
          style={{ animationDuration: '4.5s', animationDelay: '1s' }}
        />
        <span
          className="absolute w-[32rem] h-[32rem] rounded-full border border-emerald-500/[0.03] animate-ping"
          style={{ animationDuration: '6s', animationDelay: '2s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-emerald-500 uppercase">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Classified — Eyes Only
        </div>

        <h1 className="mt-5 text-6xl sm:text-7xl font-bold tracking-tight text-white leading-none">
          Ping Mission
        </h1>

        <p className="mt-6 max-w-xs text-sm text-zinc-400 leading-relaxed">
          Send encrypted location pings. Reply to form a trail. All transmissions are agent-scoped
          and secured.
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
            className="rounded-lg border border-zinc-700 px-6 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-400 hover:text-white"
          >
            Create Account
          </Link>
        </div>
      </div>
    </main>
  );
}
