import Link from "next/link";
import { getFeaturedPartners, getFeaturedAnnouncements } from "@/lib/contentful";
import PartnerCard from "@/components/PartnerCard";
import AnthropicLogo from "@/components/AnthropicLogo";

export const revalidate = 60;

export default async function HomePage() {
  const [partners, announcements] = await Promise.all([
    getFeaturedPartners(),
    getFeaturedAnnouncements(2),
  ]);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-cream-200">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <AnthropicLogo className="mb-8 h-8 w-8 text-ink" />
          <h1 className="max-w-3xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            Claude Partner Hub
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Resources, enablement, and everything you need to build and
            sell with Claude — from the Claude Partner Network.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/partners"
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
            >
              Explore partners
            </Link>
            <Link
              href="/resources"
              className="rounded-md border border-cream-200 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-cream-300 hover:bg-cream-50"
            >
              Browse resources
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      {partners.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-serif text-2xl font-semibold text-ink">
                Featured partners
              </h2>
              <p className="mt-2 text-ink-muted">
                Leading organizations in the Claude Partner Network
              </p>
            </div>
            <Link
              href="/partners"
              className="hidden text-sm font-medium text-tawny hover:text-tawny-hover sm:block"
            >
              View all
            </Link>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <PartnerCard key={p.id} partner={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Announcements */}
      {announcements.length > 0 && (
        <section className="border-t border-cream-200">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-serif text-2xl font-semibold text-ink">
                  Latest news
                </h2>
                <p className="mt-2 text-ink-muted">
                  Announcements and updates from the Claude Partner Network
                </p>
              </div>
              <Link
                href="/announcements"
                className="hidden text-sm font-medium text-tawny hover:text-tawny-hover sm:block"
              >
                All announcements
              </Link>
            </div>
            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {announcements.map((a) => (
                <Link
                  key={a.id}
                  href={`/announcements/${a.slug}`}
                  className="group rounded-lg border border-cream-200 bg-white p-6 transition-colors hover:border-cream-300"
                >
                  <time className="text-sm text-ink-muted">
                    {new Date(a.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-ink transition-colors group-hover:text-tawny">
                    {a.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
