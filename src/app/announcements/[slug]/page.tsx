import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import {
  getAllAnnouncements,
  getAnnouncementBySlug,
  getRawEntryBySlug,
} from "@/lib/contentful";
import { getLocale } from "@/lib/locale";
import RichTextRenderer from "@/components/RichTextRenderer";
import AnnouncementDetailLive from "./AnnouncementDetailLive";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const announcements = await getAllAnnouncements();
  return announcements.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const announcement = await getAnnouncementBySlug(params.slug);
  return {
    title: announcement
      ? `${announcement.title} | Claude Partner Network`
      : "Announcement Not Found",
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled: preview } = draftMode();
  const locale = getLocale();

  if (preview) {
    const rawEntry = await getRawEntryBySlug("announcement", params.slug, true, locale);
    if (!rawEntry) notFound();
    return <AnnouncementDetailLive rawEntry={rawEntry} />;
  }

  const announcement = await getAnnouncementBySlug(params.slug, preview, locale);
  if (!announcement) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/announcements" className="hover:text-ink">
          Announcements
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{announcement.title}</span>
      </nav>

      <div className="flex items-center gap-3">
        <time className="text-sm text-ink-muted">
          {new Date(announcement.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {announcement.featured && (
          <span className="rounded-full bg-tawny-light px-2 py-0.5 text-xs font-semibold text-tawny">
            Featured
          </span>
        )}
      </div>
      <h1 className="font-serif mt-3 text-3xl font-semibold text-ink">
        {announcement.title}
      </h1>

      {announcement.body && (
        <div className="mt-8">
          <RichTextRenderer document={announcement.body} />
        </div>
      )}

      <div className="mt-12 border-t border-cream-200 pt-6">
        <Link
          href="/announcements"
          className="text-sm font-medium text-tawny hover:text-tawny-hover"
        >
          &larr; All announcements
        </Link>
      </div>
    </article>
  );
}
