import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import Link from "next/link";
import {
  getAllPartners,
  getPartnerBySlug,
  getResourcesByPartner,
  getRawEntryBySlug,
} from "@/lib/contentful";
import TierBadge from "@/components/TierBadge";
import PartnerDetailLive from "./PartnerDetailLive";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateStaticParams() {
  const partners = await getAllPartners();
  return partners.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const partner = await getPartnerBySlug(params.slug);
  return {
    title: partner
      ? `${partner.name} | Claude Partner Hub`
      : "Partner Not Found",
  };
}

export default async function PartnerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { isEnabled: preview } = draftMode();

  if (preview) {
    const rawEntry = await getRawEntryBySlug("partner", params.slug, true);
    if (!rawEntry) notFound();
    // Still fetch resources with preview for the related section
    const partner = await getPartnerBySlug(params.slug, true);
    const resources = partner
      ? await getResourcesByPartner(partner.id, true)
      : [];
    return <PartnerDetailLive rawEntry={rawEntry} resources={resources} />;
  }

  const partner = await getPartnerBySlug(params.slug);
  if (!partner) notFound();

  const resources = await getResourcesByPartner(partner.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <nav className="mb-8 text-sm text-ink-muted">
        <Link href="/partners" className="hover:text-ink">
          Partners
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{partner.name}</span>
      </nav>

      <div className="flex items-start gap-5">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            className="h-16 w-16 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-cream-200 text-2xl font-semibold text-ink">
            {partner.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-3xl font-semibold text-ink">
              {partner.name}
            </h1>
            <TierBadge tier={partner.tier} />
          </div>
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-tawny hover:text-tawny-hover"
            >
              {partner.websiteUrl.replace(/^https?:\/\/(www\.)?/, "")} ↗
            </a>
          )}
        </div>
      </div>

      {partner.summary && (
        <div className="mt-8 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">About</h2>
          <p className="mt-3 leading-relaxed text-ink-light">
            {partner.summary}
          </p>
        </div>
      )}

      {partner.capabilities.length > 0 && (
        <div className="mt-6 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">Capabilities</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {partner.capabilities.map((cap) => (
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

      {partner.contactEmail && (
        <div className="mt-6 rounded-lg border border-cream-200 bg-white p-6">
          <h2 className="text-sm font-medium text-ink-muted">Contact</h2>
          <a
            href={`mailto:${partner.contactEmail}`}
            className="mt-3 inline-block text-tawny hover:text-tawny-hover"
          >
            {partner.contactEmail}
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
