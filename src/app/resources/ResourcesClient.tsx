"use client";

import { useState } from "react";
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
  Gold: "text-amber-600",
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
          className="rounded-lg border border-sand-200 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
          className="rounded-lg border border-sand-200 bg-white px-3 py-2.5 text-sm text-charcoal focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
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
            <div
              key={r.id}
              className="flex flex-col rounded-xl border border-sand-200 bg-white p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-md bg-sand-100 px-2 py-0.5 text-xs font-medium text-charcoal-muted">
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
              <h3 className="mt-3 text-lg font-semibold text-charcoal">
                {r.title}
              </h3>
              {r.description && (
                <p className="mt-2 flex-1 text-sm leading-relaxed text-charcoal-muted line-clamp-3">
                  {r.description}
                </p>
              )}
              {r.fileUrl && (
                <a
                  href={r.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-medium text-amber-700 hover:text-amber-800"
                >
                  Download &darr;
                </a>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-charcoal-muted">
            No resources match your filters.
          </p>
        </div>
      )}
    </>
  );
}
