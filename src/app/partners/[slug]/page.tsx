import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getAllPartners,
  getPartnerBySlug,
  getResourcesByPartner,
} from "@/lib/contentful";
import TierBadge from "@/components/TierBadge";
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
      ? `${partner.name} | Anthropic Partner Portal`
      : "Partner Not Found",
  };
}

export default async function PartnerDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const partner = await getPartnerBySlug(params.slug);
  if (!partner) notFound();

  const resources = await getResourcesByPartner(partner.id);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-charcoal-muted">
        <Link href="/partners" className="hover:text-charcoal">
          Partners
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{partner.name}</span>
      </nav>

      {/* Header */}
      <div className="flex items-start gap-5">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            className="h-16 w-16 rounded-xl object-contain"
          />
        ) : (
          <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-sand-200 text-2xl font-bold text-charcoal">
            {partner.name.charAt(0)}
          </div>
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-charcoal">
              {partner.name}
            </h1>
            <TierBadge tier={partner.tier} />
          </div>
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm text-amber-700 hover:text-amber-800"
            >
              {partner.websiteUrl.replace(/^https?:\/\/(www\.)?/, "")} &nearr;
            </a>
          )}
        </div>
      </div>

      {/* Summary */}
      {partner.summary && (
        <div className="mt-8 rounded-xl border border-sand-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal-muted">
            About
          </h2>
          <p className="mt-3 leading-relaxed text-charcoal-light">
            {partner.summary}
          </p>
        </div>
      )}

      {/* Capabilities */}
      {partner.capabilities.length > 0 && (
        <div className="mt-6 rounded-xl border border-sand-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal-muted">
            Capabilities
          </h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {partner.capabilities.map((cap) => (
              <span
                key={cap}
                className="rounded-lg bg-sand-100 px-3 py-1.5 text-sm text-charcoal"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact */}
      {partner.contactEmail && (
        <div className="mt-6 rounded-xl border border-sand-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-charcoal-muted">
            Contact
          </h2>
          <a
            href={`mailto:${partner.contactEmail}`}
            className="mt-3 inline-block text-amber-700 hover:text-amber-800"
          >
            {partner.contactEmail}
          </a>
        </div>
      )}

      {/* Related Resources */}
      {resources.length > 0 && (
        <div className="mt-10">
          <h2 className="text-xl font-bold text-charcoal">
            Related Resources
          </h2>
          <div className="mt-4 grid gap-4">
            {resources.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-sand-200 bg-white p-5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-charcoal">{r.title}</h3>
                    {r.description && (
                      <p className="mt-1 text-sm text-charcoal-muted line-clamp-2">
                        {r.description}
                      </p>
                    )}
                  </div>
                  <span className="ml-4 shrink-0 rounded-md bg-sand-100 px-2 py-0.5 text-xs text-charcoal-muted">
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
