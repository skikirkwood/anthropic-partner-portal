import Link from "next/link";
import { getAllAnnouncements } from "@/lib/contentful";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Announcements | Anthropic Partner Portal",
};

export const revalidate = 60;

export default async function AnnouncementsPage() {
  const announcements = await getAllAnnouncements();

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-bold text-charcoal">Announcements</h1>
      <p className="mt-2 text-charcoal-muted">
        News, updates, and program announcements for the Anthropic partner
        community.
      </p>

      <div className="mt-10 space-y-6">
        {announcements.map((a) => (
          <Link
            key={a.id}
            href={`/announcements/${a.slug}`}
            className="group block rounded-xl border border-sand-200 bg-white p-6 transition-all hover:border-sand-300 hover:shadow-md"
          >
            <div className="flex items-center gap-3">
              <time className="text-xs font-medium text-charcoal-muted">
                {new Date(a.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              {a.featured && (
                <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  Featured
                </span>
              )}
            </div>
            <h2 className="mt-2 text-xl font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
              {a.title}
            </h2>
          </Link>
        ))}

        {announcements.length === 0 && (
          <p className="text-center text-charcoal-muted">
            No announcements yet.
          </p>
        )}
      </div>
    </div>
  );
}
