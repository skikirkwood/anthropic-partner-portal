import { getAllResources } from "@/lib/contentful";
import ResourcesClient from "./ResourcesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resources | Claude Partner Hub",
};

export const revalidate = 60;

export default async function ResourcesPage() {
  const resources = await getAllResources();

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-charcoal">Resources</h1>
      <p className="mt-2 text-charcoal-muted">
        Technical documentation, guides, and enablement materials for Anthropic
        partners.
      </p>

      <ResourcesClient resources={resources} />
    </div>
  );
}
