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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">Partner Directory</h1>
      <p className="mt-2 text-ink-muted">
        Explore Anthropic&apos;s certified implementation and consulting
        partners.
      </p>

      <PartnerDirectoryClient partners={partners} />
    </div>
  );
}
