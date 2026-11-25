import Link from "next/link";
import { getAllAnnouncements } from "@/lib/contentful";
import { getLocale } from "@/lib/locale";
import DataSourceBadge from "@/components/DataSourceBadge";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | Claude Partner Network",
};

export const revalidate = 60;

export default async function AnnouncementsPage() {
  const locale = getLocale();
  const announcements = await getAllAnnouncements(false, locale);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">Announcements</h1>
        <DataSourceBadge source="contentful" />
      </div>
      <p className="mt-2 text-ink-muted">
        News, updates, and program announcements for the Anthropic partner
        community.
      </p>

      <div className="mt-10 space-y-6">
        {announcements.map((a) => (
          <Link
            key={a.id}
            href={`/announcements/${a.slug}`}
            className="group block rounded-lg border border-cream-200 bg-white p-6 transition-all hover:border-cream-300"
          >
            <div className="flex items-center gap-3">
              <time className="text-xs font-medium text-ink-muted">
                {new Date(a.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {a.featured && (
                <span className="rounded-full bg-tawny-light px-2 py-0.5 text-xs font-semibold text-tawny">
                  Featured
                </span>
              )}
            </div>
            <h2 className="font-serif mt-2 text-xl font-semibold text-ink group-hover:text-tawny transition-colors">
              {a.title}
            </h2>
          </Link>
        ))}

        {announcements.length === 0 && (
          <p className="text-center text-ink-muted">
            No announcements yet.
          </p>
        )}
      </div>
    </div>
  );
}
