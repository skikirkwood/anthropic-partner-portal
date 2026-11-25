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

export interface Cta {
  text: string;
  link: string;
  openInNewTab?: boolean;
}

export interface Homepage {
  id: string;
  heroHeadline: string;
  heroSubtitle?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  partnersHeading?: string;
  partnersDescription?: string;
  newsHeading?: string;
  newsDescription?: string;
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

function resolveCta(linkField: any): Cta | undefined {
  if (!linkField?.fields) return undefined;
  const cf = linkField.fields;
  return {
    text: cf.text ?? "",
    link: cf.link ?? "",
    openInNewTab: cf.openInNewTab ?? false,
  };
}

function mapHomepage(item: any): Homepage {
  const f = item.fields;
  return {
    id: item.sys.id,
    heroHeadline: f.heroHeadline ?? "",
    heroSubtitle: f.heroSubtitle,
    primaryCta: resolveCta(f.primaryCta),
    secondaryCta: resolveCta(f.secondaryCta),
    partnersHeading: f.partnersHeading,
    partnersDescription: f.partnersDescription,
    newsHeading: f.newsHeading,
    newsDescription: f.newsDescription,
  };
}

// ---------------------------------------------------------------------------
// Raw entry fetcher (for live preview — returns unprocessed Contentful entry)
// ---------------------------------------------------------------------------

export async function getRawEntryBySlug(
  contentType: string,
  slug: string,
  preview = false,
  locale?: string
): Promise<any | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: contentType,
    "fields.slug": slug,
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items[0] ?? null;
}

export async function getRawHomepageEntry(
  preview = false,
  locale?: string
): Promise<any | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "homepage",
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items[0] ?? null;
}

// ---------------------------------------------------------------------------
// Fetch helpers (all accept preview flag for Draft Mode)
// ---------------------------------------------------------------------------

export async function getAllPartners(preview = false, locale?: string): Promise<Partner[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    order: ["fields.name"],
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapPartner);
}

export async function getFeaturedPartners(preview = false, locale?: string): Promise<Partner[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    "fields.featured": true,
    order: ["fields.name"],
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapPartner);
}

export async function getPartnerBySlug(
  slug: string,
  preview = false,
  locale?: string
): Promise<Partner | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "partner",
    "fields.slug": slug,
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapPartner(res.items[0]) : null;
}

export async function getAllResources(preview = false, locale?: string): Promise<Resource[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    order: ["fields.title"],
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapResource);
}

export async function getResourcesByPartner(
  partnerId: string,
  preview = false,
  locale?: string
): Promise<Resource[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    "fields.relatedPartner.sys.id": partnerId,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapResource);
}

export async function getResourceBySlug(
  slug: string,
  preview = false,
  locale?: string
): Promise<Resource | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "resource",
    "fields.slug": slug,
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapResource(res.items[0]) : null;
}

export async function getAllAnnouncements(preview = false, locale?: string): Promise<Announcement[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    order: ["-fields.date"],
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapAnnouncement);
}

export async function getFeaturedAnnouncements(
  limit: number = 2,
  preview = false,
  locale?: string
): Promise<Announcement[]> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    "fields.featured": true,
    order: ["-fields.date"],
    limit,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.map(mapAnnouncement);
}

export async function getAnnouncementBySlug(
  slug: string,
  preview = false,
  locale?: string
): Promise<Announcement | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "announcement",
    "fields.slug": slug,
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapAnnouncement(res.items[0]) : null;
}

export async function getPageBySlug(
  slug: string,
  preview = false,
  locale?: string
): Promise<Page | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "page",
    "fields.slug": slug,
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapPage(res.items[0]) : null;
}

export async function getHomepage(preview = false, locale?: string): Promise<Homepage | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "homepage",
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapHomepage(res.items[0]) : null;
}

// ---------------------------------------------------------------------------
// About Page
// ---------------------------------------------------------------------------

export interface AboutPageValue {
  title: string;
  description: string;
}

export interface AboutPageStat {
  value: string;
  label: string;
}

export interface AboutPageMilestone {
  year: string;
  title: string;
  description: string;
}

export interface AboutPage {
  id: string;
  heroLabel?: string;
  heroHeadline: string;
  heroDescription?: string;
  missionHeading?: string;
  missionBody?: string;
  missionQuote?: string;
  missionQuoteAttribution?: string;
  valuesHeading?: string;
  valuesDescription?: string;
  values: AboutPageValue[];
  stats: AboutPageStat[];
  milestonesHeading?: string;
  milestonesDescription?: string;
  milestones: AboutPageMilestone[];
  ctaHeading?: string;
  ctaDescription?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
}

function mapAboutPage(item: any): AboutPage {
  const f = item.fields;
  return {
    id: item.sys.id,
    heroLabel: f.heroLabel,
    heroHeadline: f.heroHeadline ?? "",
    heroDescription: f.heroDescription,
    missionHeading: f.missionHeading,
    missionBody: f.missionBody,
    missionQuote: f.missionQuote,
    missionQuoteAttribution: f.missionQuoteAttribution,
    valuesHeading: f.valuesHeading,
    valuesDescription: f.valuesDescription,
    values: Array.isArray(f.values) ? f.values : [],
    stats: Array.isArray(f.stats) ? f.stats : [],
    milestonesHeading: f.milestonesHeading,
    milestonesDescription: f.milestonesDescription,
    milestones: Array.isArray(f.milestones) ? f.milestones : [],
    ctaHeading: f.ctaHeading,
    ctaDescription: f.ctaDescription,
    primaryCta: resolveCta(f.primaryCta),
    secondaryCta: resolveCta(f.secondaryCta),
  };
}

export async function getAboutPage(
  preview = false,
  locale?: string
): Promise<AboutPage | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "aboutPage",
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items.length > 0 ? mapAboutPage(res.items[0]) : null;
}

export async function getRawAboutPageEntry(
  preview = false,
  locale?: string
): Promise<any | null> {
  const c = getClient(preview);
  const res = await c.getEntries({
    content_type: "aboutPage",
    limit: 1,
    include: 2,
    ...(locale ? { locale } : {}),
  });
  return res.items[0] ?? null;
}
