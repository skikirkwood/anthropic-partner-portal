"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AnthropicLogo from "./AnthropicLogo";

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/partners", label: "Partners" },
  { href: "/resources", label: "Resources" },
  { href: "/announcements", label: "News" },
];

const locales = [
  { code: "en-US", label: "EN", flag: "🇺🇸" },
  { code: "fr-CA", label: "FR", flag: "🇨🇦" },
  { code: "de-DE", label: "DE", flag: "🇩🇪" },
];

function PersonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
    </svg>
  );
}

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 20 20"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10 18a8 8 0 100-16 8 8 0 000 16z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 10h15M10 2a12.3 12.3 0 014 8 12.3 12.3 0 01-4 8 12.3 12.3 0 01-4-8 12.3 12.3 0 014-8z"
      />
    </svg>
  );
}

function getLocaleCookie(): string {
  if (typeof document === "undefined") return "en-US";
  const match = document.cookie.match(/(?:^|;\s*)locale=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : "en-US";
}

function setLocaleCookie(locale: string) {
  document.cookie = `locale=${encodeURIComponent(locale)};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [localeOpen, setLocaleOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState("en-US");
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setCurrentLocale(getLocaleCookie());
  }, []);

  function handleLocaleChange(code: string) {
    setLocaleCookie(code);
    setCurrentLocale(code);
    setLocaleOpen(false);
    router.refresh();
  }

  const activeLocale = locales.find((l) => l.code === currentLocale) ?? locales[0];

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
        <nav className="hidden items-center gap-6 md:flex">
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
              <span className="flex items-center gap-1.5 text-sm text-ink-muted">
                <PersonIcon className="h-4 w-4" />
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

          {/* Locale chooser */}
          <div className="relative ml-2">
            <button
              onClick={() => setLocaleOpen(!localeOpen)}
              className="flex items-center gap-1.5 rounded-md border border-cream-200 bg-white px-2.5 py-1.5 text-sm text-ink transition-colors hover:border-cream-300 hover:bg-cream-50"
              aria-label="Choose language"
            >
              <GlobeIcon className="h-4 w-4 text-ink-muted" />
              <span>{activeLocale.label}</span>
              <svg className="h-3 w-3 text-ink-muted" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 8.5L1.5 4h9L6 8.5z" />
              </svg>
            </button>

            {localeOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLocaleOpen(false)}
                />
                <div className="absolute right-0 z-50 mt-1 w-40 overflow-hidden rounded-md border border-cream-200 bg-white shadow-lg">
                  {locales.map((locale) => (
                    <button
                      key={locale.code}
                      onClick={() => handleLocaleChange(locale.code)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-cream-50 ${
                        locale.code === currentLocale
                          ? "font-medium text-ink"
                          : "text-ink-muted"
                      }`}
                    >
                      <span>{locale.flag}</span>
                      <span>{locale.label}</span>
                      {locale.code === currentLocale && (
                        <svg className="ml-auto h-4 w-4 text-tawny" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
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

          {/* Mobile locale chooser */}
          <div className="border-t border-cream-200 pt-3 mt-2">
            <p className="pb-1 text-xs font-medium uppercase tracking-wide text-ink-muted">Language</p>
            <div className="flex gap-2">
              {locales.map((locale) => (
                <button
                  key={locale.code}
                  onClick={() => {
                    handleLocaleChange(locale.code);
                    setMenuOpen(false);
                  }}
                  className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                    locale.code === currentLocale
                      ? "border-tawny bg-tawny-light font-medium text-ink"
                      : "border-cream-200 bg-white text-ink-muted hover:border-cream-300"
                  }`}
                >
                  {locale.flag} {locale.label}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile auth */}
          {session?.user ? (
            <div className="mt-2 border-t border-cream-200 pt-3">
              <p className="flex items-center gap-1.5 py-1 text-sm text-ink-muted">
                <PersonIcon className="h-4 w-4" />
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
