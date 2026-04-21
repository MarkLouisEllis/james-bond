import { UserButton } from '@clerk/nextjs';
import Link from 'next/link';

const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/send-ping', label: 'Send Ping' },
  { href: '/all-pings', label: 'All Pings' },
];

export default function Nav() {
  return (
    <nav className="flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 sm:px-8 py-4">
      <Link
        href="/dashboard"
        className="font-mono text-sm font-bold tracking-widest text-white uppercase"
      >
        Ping Mission
      </Link>

      <div className="flex items-center gap-3 sm:gap-6">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="text-xs sm:text-sm text-zinc-400 transition hover:text-white"
          >
            {label}
          </Link>
        ))}
        <UserButton />
      </div>
    </nav>
  );
}
