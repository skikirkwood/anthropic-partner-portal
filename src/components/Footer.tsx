import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-sand-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-charcoal">
                <span className="text-xs font-bold text-white">A</span>
              </div>
              <span className="font-semibold text-charcoal">
                Anthropic Partners
              </span>
            </div>
            <p className="mt-3 text-sm text-charcoal-muted">
              Building safe, reliable AI together with our global partner
              ecosystem.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal">Portal</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/partners"
                  className="text-sm text-charcoal-muted hover:text-charcoal"
                >
                  Partner Directory
                </Link>
              </li>
              <li>
                <Link
                  href="/resources"
                  className="text-sm text-charcoal-muted hover:text-charcoal"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  href="/announcements"
                  className="text-sm text-charcoal-muted hover:text-charcoal"
                >
                  Announcements
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-charcoal">Anthropic</h4>
            <ul className="mt-3 space-y-2">
              <li>
                <a
                  href="https://www.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal-muted hover:text-charcoal"
                >
                  anthropic.com
                </a>
              </li>
              <li>
                <a
                  href="https://docs.anthropic.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-charcoal-muted hover:text-charcoal"
                >
                  API Documentation
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-sand-200 pt-6 text-center text-xs text-charcoal-muted">
          &copy; {new Date().getFullYear()} Anthropic. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
