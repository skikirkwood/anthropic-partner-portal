import Link from "next/link";
import AnthropicLogo from "./AnthropicLogo";

export default function Footer() {
  return (
    <footer className="border-t border-cream-200">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <AnthropicLogo className="h-4 w-4 text-ink" />
              <span className="text-sm font-medium text-ink">
                Claude Partner Hub
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              The Claude Partner Network — building safe, reliable AI
              together with our global partner ecosystem.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-ink">Portal</h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <Link
                  href="/partners"
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  Partner directory
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/announcements"
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  Announcements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-ink">Anthropic</h4>
            <ul className="mt-3 space-y-2.5">
              <li>
                <a
                  href="https://www.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  anthropic.com
                </a>
              </li>
              <li>
                <a
                  href="https://docs.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-ink-muted hover:text-ink"
                >
                  API documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-cream-200 pt-6 text-center text-xs text-ink-muted">
          &copy; {new Date().getFullYear()} Anthropic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
