import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import {
  getAllResources,
  getResourceBySlug,
  getRawEntryBySlug,
} from "@/lib/contentful";
import { getLocale } from "@/lib/locale";
import { auth } from "@/auth";
import { getTierForEmail, hasAccess } from "@/lib/tiers";
import RichTextRenderer from "@/components/RichTextRenderer";
import TierBadge from "@/components/TierBadge";
import UpgradeModal from "@/components/UpgradeModal";
import ResourceDetailLive from "./ResourceDetailLive";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const resources = await getAllResources();
  return resources.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);
  return {
    title: resource
      ? `${resource.title} | Claude Partner Network`
      : "Resource Not Found",
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled: preview } = draftMode();
  const locale = getLocale();

  // In draft mode, return the raw entry for live updates
  if (preview) {
    const rawEntry = await getRawEntryBySlug("resource", params.slug, true, locale);
    if (!rawEntry) notFound();
    return <ResourceDetailLive rawEntry={rawEntry} />;
  }

  // Published mode — mapped resource
  const resource = await getResourceBySlug(params.slug, preview, locale);
  if (!resource) notFound();

  // --- Tier-based content gating ---
  const session = await auth();
  const userEmail = session?.user?.email ?? "";
  const userTier = getTierForEmail(userEmail);
  const canView = hasAccess(userTier, resource.minimumTier);

  if (!canView) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16">
        <nav className="mb-8 text-sm text-ink-muted">
          <Link href="/resources" className="hover:text-ink">
            Resources
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">{resource.title}</span>
        </nav>
        <UpgradeModal
          requiredTier={resource.minimumTier!}
          currentTier={userTier}
          resourceTitle={resource.title}
        />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/resources" className="hover:text-ink">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{resource.title}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span className="rounded-md bg-cream-100 px-2 py-0.5 text-xs font-medium text-ink-muted">
          {resource.resourceType}
        </span>
        {resource.minimumTier && (
          <TierBadge tier={resource.minimumTier} />
        )}
      </div>
      <h1 className="mt-3 font-serif text-3xl font-semibold text-ink">
        {resource.title}
      </h1>
      {resource.description && (
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">
          {resource.description}
        </p>
      )}

      {resource.body && (
        <div className="mt-10 border-t border-cream-200 pt-10">
          <RichTextRenderer document={resource.body} />
        </div>
      )}

      {resource.fileUrl && (
        <div className="mt-8">
          <a
            href={resource.fileUrl}
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
