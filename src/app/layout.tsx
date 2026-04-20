import type { Metadata } from 'next';
import { ClerkProvider, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'James Bond Ping Mission',
  description: 'Send encrypted pings with coordinates',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClerkProvider>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignInButton mode="modal">
              <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm px-4 py-2 cursor-pointer transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-purple-700 hover:bg-purple-800 text-white rounded-lg font-medium text-sm px-4 py-2 cursor-pointer transition">
                Sign Up
              </button>
            </SignUpButton>
            <UserButton />
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
