import Link from "next/link";
import TierBadge from "./TierBadge";
import type { Partner } from "@/lib/contentful";

export default function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <Link
      href={`/partners/${partner.slug}`}
      className="group flex flex-col rounded-xl border border-sand-200 bg-white p-6 transition-all hover:border-sand-300 hover:shadow-md"
    >
      <div className="mb-4 flex items-start justify-between">
        {partner.logoUrl ? (
          <img
            src={partner.logoUrl}
            alt={`${partner.name} logo`}
            className="h-10 w-10 rounded-lg object-contain"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sand-200 text-sm font-bold text-charcoal">
            {partner.name.charAt(0)}
          </div>
        )}
        <TierBadge tier={partner.tier} />
      </div>

      <h3 className="text-lg font-semibold text-charcoal group-hover:text-amber-700 transition-colors">
        {partner.name}
      </h3>

      {partner.summary && (
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-charcoal-muted">
          {partner.summary}
        </p>
      )}

      {partner.capabilities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {partner.capabilities.slice(0, 3).map((cap) => (
            <span
              key={cap}
              className="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-charcoal-muted"
            >
              {cap}
            </span>
          ))}
          {partner.capabilities.length > 3 && (
            <span className="rounded-md bg-sand-100 px-2 py-0.5 text-xs text-charcoal-muted">
              +{partner.capabilities.length - 3} more
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
