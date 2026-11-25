import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllAnnouncements,
  getAnnouncementBySlug,
} from "@/lib/contentful";
import RichTextRenderer from "@/components/RichTextRenderer";
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
      ? `${announcement.title} | Claude Partner Hub`
      : "Announcement Not Found",
  };
}

export default async function AnnouncementDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const announcement = await getAnnouncementBySlug(params.slug);
  if (!announcement) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/announcements" className="hover:text-ink">
          Announcements
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{announcement.title}</span>
      </nav>

      {/* Header */}
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

      {/* Body */}
      {announcement.body && (
        <div className="mt-8">
          <RichTextRenderer document={announcement.body} />
        </div>
      )}

      {/* Back link */}
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
