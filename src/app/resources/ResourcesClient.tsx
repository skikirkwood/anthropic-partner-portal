"use client";

import { useState } from "react";
import Link from "next/link";
import type { Resource } from "@/lib/contentful";

const resourceTypes = [
  "All",
  "Guide",
  "Case Study",
  "Technical Documentation",
  "Sales Enablement",
  "API Reference",
];

const tierLevels = ["All", "Bronze", "Silver", "Gold"];

const tierIcons: Record<string, string> = {
  Bronze: "text-orange-600",
  Silver: "text-slate-500",
  Gold: "text-tawny",
};

export default function ResourcesClient({
  resources,
}: {
  resources: Resource[];
}) {
  const [typeFilter, setTypeFilter] = useState("All");
  const [tierFilter, setTierFilter] = useState("All");

  const filtered = resources.filter((r) => {
    const matchesType =
      typeFilter === "All" || r.resourceType === typeFilter;
    const matchesTier =
      tierFilter === "All" || r.minimumTier === tierFilter;
    return matchesType && matchesTier;
  });

  return (
    <>
      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-lg border border-cream-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-tawny focus:outline-none focus:ring-1 focus:ring-tawny"
        >
          {resourceTypes.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All types" : t}
            </option>
          ))}
        </select>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="rounded-lg border border-cream-200 bg-white px-3 py-2.5 text-sm text-ink focus:border-tawny focus:outline-none focus:ring-1 focus:ring-tawny"
        >
          {tierLevels.map((t) => (
            <option key={t} value={t}>
              {t === "All" ? "All tiers" : `${t} & above`}
            </option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
            <Link
              key={r.id}
              href={`/resources/${r.slug}`}
              className="group flex flex-col rounded-lg border border-cream-200 bg-white p-6 transition-colors hover:border-cream-300"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-cream-100 px-2 py-0.5 text-xs font-medium text-ink-muted">
                  {r.resourceType}
                </span>
                {r.minimumTier && (
                  <span
                    className={`text-xs font-semibold ${
                      tierIcons[r.minimumTier] ?? ""
                    }`}
                  >
                    {r.minimumTier}+
                  </span>
                )}
              </div>
              <h3 className="mt-3 font-serif text-lg font-semibold text-ink transition-colors group-hover:text-tawny">
                {r.title}
              </h3>
              {r.description && (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted line-clamp-3">
                  {r.description}
                </p>
              )}
              <span className="mt-4 inline-flex items-center text-sm font-medium text-tawny group-hover:text-tawny-hover">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-ink-muted">
            No resources match your filters.
          </p>
        </div>
      )}
    </>
  );
}
