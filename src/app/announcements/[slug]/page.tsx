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
      ? `${announcement.title} | Anthropic Partner Portal`
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
    <article className="mx-auto max-w-3xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-charcoal-muted">
        <Link href="/announcements" className="hover:text-charcoal">
          Announcements
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{announcement.title}</span>
      </nav>

      {/* Header */}
      <div className="flex items-center gap-3">
        <time className="text-sm text-charcoal-muted">
          {new Date(announcement.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {announcement.featured && (
          <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
            Featured
          </span>
        )}
      </div>
      <h1 className="mt-3 text-3xl font-bold text-charcoal">
        {announcement.title}
      </h1>

      {/* Body */}
      {announcement.body && (
        <div className="mt-8">
          <RichTextRenderer document={announcement.body} />
        </div>
      )}

      {/* Back link */}
      <div className="mt-12 border-t border-sand-200 pt-6">
        <Link
          href="/announcements"
          className="text-sm font-medium text-amber-700 hover:text-amber-800"
        >
          &larr; All announcements
        </Link>
      </div>
    </article>
  );
}
