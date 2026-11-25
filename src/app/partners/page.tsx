import { getAllPartners } from "@/lib/contentful";
import { getLocale } from "@/lib/locale";
import DataSourceBadge from "@/components/DataSourceBadge";
import PartnerDirectoryClient from "./PartnerDirectoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Directory | Claude Partner Hub",
};

export const revalidate = 60;

export default async function PartnersPage() {
  const locale = getLocale();
  const partners = await getAllPartners(false, locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">Partner Directory</h1>
        <DataSourceBadge source="salesforce" />
      </div>
      <p className="mt-2 text-ink-muted">
        Explore Anthropic&apos;s certified implementation and consulting
        partners.
      </p>

      <PartnerDirectoryClient partners={partners} />
    </div>
  );
}
