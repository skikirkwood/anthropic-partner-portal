"use client";

import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import Link from "next/link";
import RichTextRenderer from "@/components/RichTextRenderer";
import TierBadge from "@/components/TierBadge";

export default function ResourceDetailLive({
  rawEntry,
}: {
  rawEntry: any;
}) {
  const entry = useContentfulLiveUpdates(rawEntry);
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry.sys.id,
  });
  const f = entry.fields;

  const fileUrl = f.file?.fields?.file?.url
    ? `https:${f.file.fields.file.url}`
    : undefined;

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/resources" className="hover:text-ink">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{f.title}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span
          className="rounded-md bg-cream-100 px-2 py-0.5 text-xs font-medium text-ink-muted"
          {...inspectorProps({ fieldId: "resourceType" })}
        >
          {f.resourceType}
        </span>
        {f.minimumTier && (
          <span {...inspectorProps({ fieldId: "minimumTier" })}>
            <TierBadge tier={f.minimumTier} />
          </span>
        )}
      </div>
      <h1
        className="mt-3 font-serif text-3xl font-semibold text-ink"
        {...inspectorProps({ fieldId: "title" })}
      >
        {f.title}
      </h1>
      {f.description && (
        <p
          className="mt-3 text-lg leading-relaxed text-ink-muted"
          {...inspectorProps({ fieldId: "description" })}
        >
          {f.description}
        </p>
      )}

      {f.body && (
        <div
          className="mt-10 border-t border-cream-200 pt-10"
          {...inspectorProps({ fieldId: "body" })}
        >
          <RichTextRenderer document={f.body} />
        </div>
      )}

      {fileUrl && (
        <div className="mt-8" {...inspectorProps({ fieldId: "file" })}>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
          >
            Download resource &darr;
          </a>
        </div>
      )}

      <div className="mt-12 border-t border-cream-200 pt-6">
        <Link
          href="/resources"
          className="text-sm font-medium text-tawny hover:text-tawny-hover"
        >
          &larr; All resources
        </Link>
      </div>
    </article>
  );
}
