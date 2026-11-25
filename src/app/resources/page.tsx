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
    <div className="mx-auto max-w-6xl px-6 py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink">Resources</h1>
      <p className="mt-2 text-ink-muted">
        Technical documentation, guides, and enablement materials for Anthropic
        partners.
      </p>

      <ResourcesClient resources={resources} />
    </div>
  );
}
