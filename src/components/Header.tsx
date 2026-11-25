"use client";

import Link from "next/link";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import AnthropicLogo from "./AnthropicLogo";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/partners", label: "Partners" },
  { href: "/resources", label: "Resources" },
  { href: "/announcements", label: "News" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-cream-200 bg-cream-100/95 backdrop-blur supports-[backdrop-filter]:bg-cream-100/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2.5">
          <AnthropicLogo className="h-5 w-5 text-ink" />
          <span className="text-sm font-medium tracking-tight text-ink">
            Claude Partner Hub
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-ink-muted transition-colors hover:text-ink"
            >
              {link.label}
            </Link>
          ))}

          {/* Auth controls */}
          {status === "loading" ? (
            <span className="text-sm text-ink-muted">&hellip;</span>
          ) : session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-ink-muted">
                {session.user.name || session.user.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="rounded-md border border-cream-200 bg-white px-3 py-1.5 text-sm text-ink transition-colors hover:border-cream-300 hover:bg-cream-50"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-md bg-ink px-4 py-1.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
            >
              Sign in
            </Link>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5 text-ink"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t border-cream-200 px-6 py-4 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          {/* Mobile auth */}
          {session?.user ? (
            <div className="mt-2 border-t border-cream-200 pt-3">
              <p className="py-1 text-sm text-ink-muted">
                {session.user.name || session.user.email}
              </p>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="py-2 text-sm text-ink-muted transition-colors hover:text-ink"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/sign-in"
              className="mt-2 block border-t border-cream-200 pt-3 text-sm font-medium text-ink transition-colors hover:text-tawny"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
