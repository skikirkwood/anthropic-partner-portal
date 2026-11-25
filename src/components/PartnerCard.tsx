import Link from "next/link";
import TierBadge from "./TierBadge";
import type { Partner } from "@/lib/contentful";

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group flex flex-col rounded-lg border border-cream-200 bg-white p-6 transition-colors hover:border-cream-300"
    >
      <div className="mb-4 flex items-start justify-between">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            className="h-10 w-10 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cream-200 text-sm font-medium text-ink">
            {partner.name.charAt(0)}
          </div>
        )}
        <TierBadge tier={partner.tier} />
      </div>

      <h3 className="font-serif text-lg font-semibold text-ink transition-colors group-hover:text-tawny">
        {partner.name}
      </h3>

      {partner.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-muted">
          {partner.summary}
        </p>
      )}

      {partner.capabilities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {partner.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="rounded bg-cream-100 px-2 py-0.5 text-xs text-ink-muted"
            >
              {cap}
            </span>
          ))}
          {partner.capabilities.length > 3 && (
            <span className="rounded bg-cream-100 px-2 py-0.5 text-xs text-ink-muted">
              +{partner.capabilities.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
