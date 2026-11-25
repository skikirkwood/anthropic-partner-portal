"use client";

import { useState } from "react";
import PartnerCard from "@/components/PartnerCard";
import type { Partner } from "@/lib/contentful";

const tiers = ["All", "Gold", "Silver", "Bronze"] as const;

export default function PartnerDirectoryClient({
  partners,
}: {
  partners: Partner[];
}) {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("All");

  const filtered = partners.filter((p) => {
    const matchesTier = tierFilter === "All" || p.tier === tierFilter;
    const matchesSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.capabilities.some((c) =>
        c.toLowerCase().includes(search.toLowerCase())
      );
    return matchesTier && matchesSearch;
  });

  return (
    <>
      {/* Filters */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <input
          type="text"
          placeholder="Search partners or capabilities..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-cream-200 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-muted/50 focus:border-tawny focus:outline-none focus:ring-1 focus:ring-tawny sm:max-w-sm"
        />
        <div className="flex gap-2">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setTierFilter(tier)}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                tierFilter === tier
                  ? "bg-ink text-white"
                  : "bg-cream-100 text-ink-muted hover:bg-cream-200"
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <PartnerCard key={p.id} partner={p} />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-ink-muted">
            No partners match your filters. Try broadening your search.
          </p>
        </div>
      )}
    </>
  );
}
