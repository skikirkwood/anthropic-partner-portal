# Claude Partner Hub

A Next.js 14 (App Router) partner portal for the Anthropic partner ecosystem, powered by Contentful CMS. Built as a demo showcasing content management, localization, live preview, and authentication.

**Live site:** [anthropic-partner-portal.colorfuldemo.com](https://anthropic-partner-portal.colorfuldemo.com)

## Features

- **CMS-driven content** — all pages pull structured content from Contentful, including rich text, linked assets, and reference fields
- **Live Preview & Inspector Mode** — editors see changes in real time via Contentful's Draft Mode integration
- **Localization** — cookie-based locale switcher (English, French-Canadian, German) with server-side rendering in the selected language
- **Authentication** — NextAuth.js (Auth.js v5) with Credentials provider and route-level protection
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
