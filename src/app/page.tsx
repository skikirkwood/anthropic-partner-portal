import Link from "next/link";
import { getFeaturedPartners, getFeaturedAnnouncements } from "@/lib/contentful";
import PartnerCard from "@/components/PartnerCard";
import TierBadge from "@/components/TierBadge";
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
      <section className="relative overflow-hidden bg-charcoal">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-amber-500 blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-amber-600 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
            <AnthropicLogo className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Claude Partner Hub
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
            Your central hub for the Claude Partner Network &mdash; resources,
            enablement, and everything you need to build and sell with Claude.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/partners"
              className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-700"
            >
              Explore Partners
            </Link>
            <Link
              href="/resources"
              className="rounded-lg bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition-colors hover:bg-white/20"
            >
              Browse Resources
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      {partners.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-charcoal">
                Featured Partners
              </h2>
              <p className="mt-1 text-charcoal-muted">
                Leading organizations in the Claude Partner Network
              </p>
            </div>
            <Link
              href="/partners"
              className="hidden text-sm font-medium text-amber-700 hover:text-amber-800 sm:block"
            >
              View all partners &rarr;
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((p) => (
              <PartnerCard key={p.id} partner={p} />
            ))}
          </div>
        </section>
      )}

      {/* Latest Announcements */}
      {announcements.length > 0 && (
        <section className="border-t border-sand-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-2xl font-bold text-charcoal">
                  Latest News
                </h2>
                <p className="mt-1 text-charcoal-muted">
                  Announcements and updates from the Claude Partner Network
                </p>
              </div>
              <Link
                href="/announcements"
                className="hidden text-sm font-medium text-amber-700 hover:text-amber-800 sm:block"
              >
                All announcements &rarr;
              </Link>
            </div>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {announcements.map((a) => (
                <Link
                  key={a.id}
                  href={`/announcements/${a.slug}`}
                  className="group rounded-xl border border-sand-200 p-6 transition-all hover:border-sand-300 hover:shadow-md"
                >
                  <time className="text-xs font-medium text-charcoal-muted">
                    {new Date(a.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h3 className="mt-2 text-lg font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
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
