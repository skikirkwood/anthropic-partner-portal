# Claude Partner Hub

A Next.js 14 (App Router) partner portal for the Anthropic partner ecosystem, powered by Contentful CMS. Built as a demo showcasing content management, localization, live preview, and authentication.

**Live site:** [anthropic-partner-portal.colorfuldemo.com](https://anthropic-partner-portal.colorfuldemo.com)

## Features

- **CMS-driven content** — all pages pull structured content from Contentful, including rich text, linked assets, and reference fields
- **Live Preview & Inspector Mode** — editors see changes in real time via Contentful's Draft Mode integration
- **Localization** — cookie-based locale switcher (English, French-Canadian, German) with server-side rendering in the selected language
- **Authentication** — NextAuth.js (Auth.js v5) with Credentials provider and route-level protection
- **Claude Partner Assistant** — AI chat widget that surfaces answers from Salesforce Partner Portal, Contentful CMS, and Anthropic Docs with source citations
- **Custom design system** — Tailwind CSS with custom color tokens (cream, ink, tawny) inspired by anthropic.com

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Create `.env.local` with the following:

   ```
   CONTENTFUL_SPACE_ID=<your-space-id>
   CONTENTFUL_DELIVERY_TOKEN=<CDA-token>
   CONTENTFUL_PREVIEW_TOKEN=<CPA-token>
   CONTENTFUL_ENVIRONMENT=master
   CONTENTFUL_PREVIEW_SECRET=<a-random-secret>
   AUTH_SECRET=<a-random-secret>
   ```

   CDA and CPA tokens are found in Contentful under Settings > API keys.

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Demo Credentials

| Email | Password | Role | Tier |
| --- | --- | --- | --- |
| demo@anthropic.com | demo123 | Anthropic staff | Platinum |
| partner@deloitte.com | deloitte123 | Deloitte partner | Platinum |
| partner@slalom.com | slalom123 | Slalom partner | Silver |

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add all environment variables in the Vercel project settings.
4. Deploy.

## Architecture

```
src/
  app/
    page.tsx                    # Homepage — featured partners + announcements
    layout.tsx                  # Root layout with Header, Footer, SessionWrapper
    globals.css                 # Tailwind base + custom design tokens
    not-found.tsx               # 404 page
    sign-in/page.tsx            # NextAuth credentials sign-in form
    HomepageLive.tsx            # Live Preview wrapper for homepage
    about/
      page.tsx                  # About page — mission, values, stats, milestones
      AboutPageLive.tsx         # Live Preview wrapper
    announcements/
      page.tsx                  # Announcement listing
      [slug]/
        page.tsx                # Announcement detail with rich text body
        AnnouncementDetailLive.tsx
    partners/
      page.tsx                  # Partner directory with search + tier filter
      PartnerDirectoryClient.tsx  # Client component for filtering
      [slug]/
        page.tsx                # Partner profile page
        PartnerDetailLive.tsx
    resources/
      page.tsx                  # Resource catalog — all tiers visible
      ResourcesClient.tsx       # Client component for type + tier filtering
      [slug]/
        page.tsx                # Resource detail — tier-gated access check
        ResourceDetailLive.tsx
    api/
      auth/[...nextauth]/route.ts  # NextAuth API route handler
      draft/route.ts               # Enable Contentful Draft Mode
      disable-draft/route.ts       # Disable Draft Mode
  components/
    Header.tsx                  # Top nav with auth UI + locale chooser
    Footer.tsx                  # Site footer
    AnthropicLogo.tsx           # SVG logo component
    ContentfulPreviewProvider.tsx  # Wraps pages in Draft Mode for live updates
    PartnerCard.tsx             # Partner grid card with tier badge + capabilities
    RichTextRenderer.tsx        # Renders Contentful rich text documents
    SessionWrapper.tsx          # NextAuth SessionProvider for client components
    TierBadge.tsx               # Colored tier label (Platinum/Gold/Silver)
    ClaudeAssistant.tsx         # AI chat widget — floating launcher + chat panel
    DataSourceBadge.tsx         # Visual pill showing data source (Salesforce/Contentful)
    UpgradeModal.tsx            # Shown when user tier < resource minimumTier
  lib/
    contentful.ts               # Contentful CDA/CPA clients + 15 fetch functions
    locale.ts                   # Server-side cookie-based locale reader
    tiers.ts                    # Domain-to-tier mapping + access checks
  auth.ts                       # NextAuth config with demo credentials
  middleware.ts                 # Route protection — redirects unauthenticated users
```

### How pages work

Every page is a React Server Component that reads the locale cookie, fetches content from Contentful in that locale, and renders it. Listing pages (partners, resources, announcements) pass data to a client component that handles filtering and search without additional network requests.

### Draft Mode and Live Preview

When Draft Mode is enabled via `/api/draft`, pages switch from the Content Delivery API to the Content Preview API and wrap content in a `ContentfulPreviewProvider`. Each detail page has a companion `*Live.tsx` component that receives the raw Contentful entry and subscribes to real-time field updates via `@contentful/live-preview`. Inspector Mode annotations let editors click any field to jump to it in the Contentful web app.

### Tier-based content gating

The resource detail page calls `auth()` to get the current session, derives the user's partner tier from their email domain via `tiers.ts`, and compares it to the resource's `minimumTier` field. If the user's tier is insufficient, the page renders an `UpgradeModal` instead of the resource content. The resource listing page is ungated — all users see every card.

### Claude Partner Assistant

A floating chat widget (bottom-right corner of every page) demonstrates how an AI assistant can surface information from multiple backend systems in a single conversational interface. The assistant retrieves answers from Salesforce Partner Portal (deal pipeline, referrals, MDF balances), Contentful CMS (resources, announcements, program guides), and Anthropic documentation (API docs, certification exams). Each response includes color-coded source citations showing which system provided the data.

### Static generation with ISR

Pages are statically generated at build time via `generateStaticParams` and revalidated every 60 seconds (`revalidate = 60`). New content published in Contentful appears on the next revalidation cycle without a redeploy.

## Content Model

Seven Contentful content types power the site:

| Content Type | Purpose |
| --- | --- |
| **Homepage** | Hero section, headings, and featured content configuration |
| **About Page** | Mission, values, stats, milestones, and CTA sections |
| **Partner** | Partner organizations with tier (Platinum/Gold/Silver), capabilities, and profile |
| **Resource** | Guides, case studies, API docs, whitepapers, and videos — optionally linked to a partner |
| **Announcement** | News items with rich text bodies and featured flag |
| **Page** | Generic CMS-driven pages |
| **CTA** | Reusable call-to-action blocks referenced by Homepage and About Page |

All user-facing text fields are localized across three locales: `en-US` (default), `fr-CA`, and `de-DE`.

## Tier-Based Content Gating

Resources have a `minimumTier` field (Silver, Gold, or Platinum). When a signed-in user clicks a resource that requires a higher tier than their partnership level, an upgrade modal is shown instead of the content. The user's tier is derived from their email domain (e.g., `deloitte.com` → Platinum, `slalom.com` → Silver). Anthropic staff (`anthropic.com`) have full Platinum access.

The resource listing page remains fully visible to all users — gating only applies when opening a specific resource.

## Localization

The locale switcher in the top nav sets a `locale` cookie. Server components read this cookie and pass the locale to every Contentful fetch call. Contentful returns localized content with automatic fallback to `en-US` when a translation is missing.

## Live Preview

Draft Mode is activated via `/api/draft?secret=<CONTENTFUL_PREVIEW_SECRET>&slug=<slug>`. When active, the site fetches from Contentful's Preview API and renders a `ContentfulPreviewProvider` that enables live field updates and Inspector Mode annotations.

Content Preview URLs are configured in Contentful under Settings > Content Preview for each content type.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS (custom design tokens)
- Contentful CDA/CPA via `contentful` SDK
- `@contentful/rich-text-react-renderer` for rich text
- `@contentful/live-preview` for Draft Mode live updates and Inspector Mode
- NextAuth.js v5 (Auth.js) for authentication
- Deployed on Vercel
