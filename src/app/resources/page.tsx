import { getAllResources } from "@/lib/contentful";
import { getLocale } from "@/lib/locale";
import DataSourceBadge from "@/components/DataSourceBadge";
import ResourcesClient from "./ResourcesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Claude Partner Hub",
};

export const revalidate = 60;

export default async function ResourcesPage() {
  const locale = getLocale();
  const resources = await getAllResources(false, locale);

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-semibold text-ink">Resources</h1>
        <DataSourceBadge source="contentful" />
      </div>
      <p className="mt-2 text-ink-muted">
        Technical documentation, guides, and enablement materials for Anthropic
        partners.
      </p>

      <ResourcesClient resources={resources} />
    </div>
  );
}
