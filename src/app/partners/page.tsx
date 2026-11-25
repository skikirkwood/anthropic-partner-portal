import { getAllPartners } from "@/lib/contentful";
import PartnerDirectoryClient from "./PartnerDirectoryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Partner Directory | Claude Partner Hub",
};

export const revalidate = 60;

export default async function PartnersPage() {
  const partners = await getAllPartners();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-charcoal">Partner Directory</h1>
      <p className="mt-2 text-charcoal-muted">
        Explore Anthropic&apos;s certified implementation and consulting
        partners.
      </p>

      <PartnerDirectoryClient partners={partners} />
    </div>
  );
}
