"use client";

import { useContentfulLiveUpdates } from "@contentful/live-preview/react";
import Link from "next/link";
import RichTextRenderer from "@/components/RichTextRenderer";

export default function AnnouncementDetailLive({
  rawEntry,
}: {
  rawEntry: any;
}) {
  const entry = useContentfulLiveUpdates(rawEntry);
  const f = entry.fields;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/announcements" className="hover:text-ink">
          Announcements
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{f.title}</span>
      </nav>

      <div className="flex items-center gap-3">
        <time className="text-sm text-ink-muted">
          {new Date(f.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </time>
        {f.featured && (
          <span className="rounded-full bg-tawny-light px-2 py-0.5 text-xs font-semibold text-tawny">
            Featured
          </span>
        )}
      </div>
      <h1 className="font-serif mt-3 text-3xl font-semibold text-ink">
        {f.title}
      </h1>

      {f.body && (
        <div className="mt-8">
          <RichTextRenderer document={f.body} />
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
