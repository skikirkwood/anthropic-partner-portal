import { createClient, type EntrySkeletonType, type Asset } from "contentful";
import type { Document } from "@contentful/rich-text-types";

// ---------------------------------------------------------------------------
// Clients — CDA (published) and CPA (preview / draft)
// ---------------------------------------------------------------------------

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
});

const previewClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_PREVIEW_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT ?? "master",
  host: "preview.contentful.com",
});

function getClient(preview = false) {
  return preview ? previewClient : client;
}

// ---------------------------------------------------------------------------
// Content-type skeletons (internal)
// ---------------------------------------------------------------------------

interface PartnerFields {
  internalName: EntrySkeletonType["fields"];
  name: string;
  slug: string;
  logo?: Asset;
  tier: "Gold" | "Silver" | "Bronze";
  summary?: string;
  capabilities?: string[];
  websiteUrl?: string;
  contactEmail?: string;
  featured?: boolean;
}

interface ResourceFields {
  internalName: EntrySkeletonType["fields"];
  title: string;
  slug: string;
  description?: string;
  body?: Document;
  resourceType:
    | "Guide"
    | "Case Study"
    | "Technical Documentation"
    | "Sales Enablement"
    | "API Reference";
  minimumTier?: "Bronze" | "Silver" | "Gold";
  file?: Asset;
  relatedPartner?: { sys: { id: string } };
}

interface AnnouncementFields {
  internalName: EntrySkeletonType["fields"];
  title: string;
  slug: string;
  date: string;
  body?: Document;
  featured?: boolean;
}

interface PageFields {
  internalName: EntrySkeletonType["fields"];
  title: string;
  slug: string;
  body?: Document;
}

// ---------------------------------------------------------------------------
// Public interfaces (resolved)
// ---------------------------------------------------------------------------

export interface Partner {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  tier: "Gold" | "Silver" | "Bronze";
  summary?: string;
  capabilities: string[];
  websiteUrl?: string;
  contactEmail?: string;
  featured: boolean;
}

export interface Resource {
  id: string;
  title: string;
  slug: string;
  description?: string;
  body?: Document;
  resourceType: string;
  minimumTier?: string;
  fileUrl?: string;
  relatedPartnerId?: string;
}

export interface Announcement {
  id: string;
  title: string;
  slug: string;
  date: string;
  body?: Document;
  featured: boolean;
}

export interface Page {
  id: string;
  title: string;
  slug: string;
  body?: Document;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function mapPartner(item: any): Partner {
  const f = item.fields;
  const logoAsset = f.logo;
  return {
    id: item.sys.id,
    name: f.name ?? "",
    slug: f.slug ?? "",
    logoUrl: logoAsset?.fields?.file?.url
      ? `https:${logoAsset.fields.file.url}`
      : undefined,
    tier: f.tier ?? "Bronze",
    summary: f.summary,
    capabilities: f.capabilities ?? [],
    websiteUrl: f.websiteUrl,
    contactEmail: f.contactEmail,
    featured: f.featured ?? false,
  };
}

function mapResource(item: any): Resource {
  const f = item.fields;
  const fileAsset = f.file;
  return {
    id: item.sys.id,
    title: f.title ?? "",
    slug: f.slug ?? "",
    description: f.description,
    body: f.body,
    resourceType: f.resourceType ?? "Guide",
    minimumTier: f.minimumTier,
    fileUrl: fileAsset?.fields?.file?.url
      ? `https:${fileAsset.fields.file.url}`
      : undefined,
    relatedPartnerId: f.relatedPartner?.sys?.id,
  };
}

function mapAnnouncement(item: any): Announcement {
  const f = item.fields;
  return {
    id: item.sys.id,
    title: f.title ?? "",
    slug: f.slug ?? "",
    date: f.date ?? "",
    body: f.body,
    featured: f.featured ?? false,
  };
}

function mapPage(item: any): Page {
  const f = item.fields;
  return {
    id: item.sys.id,
    title: f.title ?? "",
    slug: f.slug ?? "",
    body: f.body,
  };
}

// ---------------------------------------------------------------------------
// Raw entry fetcher (for live preview — returns unprocessed Contentful entry)
// ---------------------------------------------------------------------------

export async function getRawEntryBySlug(
  contentType: string,
  slug: string,
  preview = false
): Promise<any | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: contentType,
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });
  return res.items[0] ?? null;
}

// ---------------------------------------------------------------------------
// Fetch helpers (all accept preview flag for Draft Mode)
// ---------------------------------------------------------------------------

export async function getAllPartners(preview = false): Promise<Partner[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    order: ["fields.name"],
    include: 2,
  });
  return res.items.map(mapPartner);
}

export async function getFeaturedPartners(preview = false): Promise<Partner[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    "fields.featured": true,
    include: 2,
  });
  return res.items.map(mapPartner);
}

export async function getPartnerBySlug(
  slug: string,
  preview = false
): Promise<Partner | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });
  return res.items.length > 0 ? mapPartner(res.items[0]) : null;
}

export async function getAllResources(preview = false): Promise<Resource[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    order: ["fields.title"],
    include: 2,
  });
  return res.items.map(mapResource);
}

export async function getResourcesByPartner(
  partnerId: string,
  preview = false
): Promise<Resource[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    "fields.relatedPartner.sys.id": partnerId,
    include: 2,
  });
  return res.items.map(mapResource);
}

export async function getResourceBySlug(
  slug: string,
  preview = false
): Promise<Resource | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });
  return res.items.length > 0 ? mapResource(res.items[0]) : null;
}

export async function getAllAnnouncements(preview = false): Promise<Announcement[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    order: ["-fields.date"],
    include: 2,
  });
  return res.items.map(mapAnnouncement);
}

export async function getFeaturedAnnouncements(
  limit: number = 2,
  preview = false
): Promise<Announcement[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    "fields.featured": true,
    order: ["-fields.date"],
    limit,
    include: 2,
  });
  return res.items.map(mapAnnouncement);
}

export async function getAnnouncementBySlug(
  slug: string,
  preview = false
): Promise<Announcement | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });
  return res.items.length > 0 ? mapAnnouncement(res.items[0]) : null;
}

export async function getPageBySlug(
  slug: string,
  preview = false
): Promise<Page | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "page",
    "fields.slug": slug,
    limit: 1,
    include: 2,
  });
  return res.items.length > 0 ? mapPage(res.items[0]) : null;
}
