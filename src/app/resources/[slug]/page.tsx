import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllResources,
  getResourceBySlug,
} from "@/lib/contentful";
import RichTextRenderer from "@/components/RichTextRenderer";
import TierBadge from "@/components/TierBadge";
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
      ? `${resource.title} | Claude Partner Hub`
      : "Resource Not Found",
  };
}

export default async function ResourceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) notFound();

  return (
    <article className="mx-auto max-w-3xl px-6 py-16">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/resources" className="hover:text-ink">
          Resources
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{resource.title}</span>
      </nav>

      {/* Header */}
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

      {/* Body */}
      {resource.body && (
        <div className="mt-10 border-t border-cream-200 pt-10">
          <RichTextRenderer document={resource.body} />
        </div>
      )}

      {/* Download link if file exists */}
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

      {/* Back link */}
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
