"use client";

import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import Link from "next/link";
import TierBadge from "@/components/TierBadge";
import type { Resource } from "@/lib/contentful";

export default function PartnerDetailLive({
  rawEntry,
  resources,
}: {
  rawEntry: any;
  resources: Resource[];
}) {
  const entry = useContentfulLiveUpdates(rawEntry);
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry.sys.id,
  });
  const f = entry.fields;

  const logoUrl = f.logo?.fields?.file?.url
    ? `https:${f.logo.fields.file.url}`
    : undefined;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/partners" className="hover:text-ink">
          Partners
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{f.name}</span>
      </nav>

      <div className="flex items-start gap-5">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={`${f.name} logo`}
            className="h-16 w-16 rounded-lg object-contain"
            {...inspectorProps({ fieldId: "logo" })}
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-cream-200 text-2xl font-semibold text-ink">
            {(f.name ?? "").charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1
              className="font-serif text-3xl font-semibold text-ink"
              {...inspectorProps({ fieldId: "name" })}
            >
              {f.name}
            </h1>
            <span {...inspectorProps({ fieldId: "tier" })}>
              <TierBadge tier={f.tier} />
            </span>
          </div>
          {f.websiteUrl && (
            <a
              href={f.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-tawny hover:text-tawny-hover"
              {...inspectorProps({ fieldId: "websiteUrl" })}
            >
              {f.websiteUrl.replace(/^https?:\/\/(www\.)?/, "")} ↗
            </a>
          )}
        </div>
      </div>

      {f.summary && (
        <div className="mt-8 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">About</h2>
          <p
            className="mt-3 leading-relaxed text-ink-light"
            {...inspectorProps({ fieldId: "summary" })}
          >
            {f.summary}
          </p>
        </div>
      )}

      {f.capabilities && f.capabilities.length > 0 && (
        <div className="mt-6 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">Capabilities</h2>
          <div
            className="mt-3 flex flex-wrap gap-2"
            {...inspectorProps({ fieldId: "capabilities" })}
          >
            {f.capabilities.map((cap: string) => (
              <span
                key={cap}
                className="rounded-lg bg-cream-100 px-3 py-1.5 text-sm text-ink"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {f.contactEmail && (
        <div className="mt-6 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">Contact</h2>
          <a
            href={`mailto:${f.contactEmail}`}
            className="mt-3 inline-block text-tawny hover:text-tawny-hover"
            {...inspectorProps({ fieldId: "contactEmail" })}
          >
            {f.contactEmail}
          </a>
        </div>
      )}

      {resources.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl font-semibold text-ink">
            Related Resources
          </h2>
          <div className="mt-4 grid gap-4">
            {resources.map((r) => (
              <div
                key={r.id}
                className="rounded-lg border border-cream-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-serif font-semibold text-ink">
                      {r.title}
                    </h3>
                    {r.description && (
                      <p className="mt-1 text-sm text-ink-muted line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <span className="ml-4 shrink-0 rounded-md bg-cream-100 px-2 py-0.5 text-xs text-ink-muted">
                    {r.resourceType}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
