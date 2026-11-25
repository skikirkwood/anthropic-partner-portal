# Anthropic Partner Portal

A Next.js 14 (App Router) application powered by Contentful, showcasing Anthropic's partner ecosystem.

## Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure environment variables:**

   Copy `.env.local.example` to `.env.local` and fill in your Contentful CDA token:

   ```bash
   cp .env.local.example .env.local
   ```

   You need a Content Delivery API token from your Contentful space settings (Settings > API keys).

3. **Run the development server:**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

## Deploy to Vercel

1. Push this repo to GitHub.
2. Import the repo in Vercel.
3. Add the environment variables (`CONTENTFUL_SPACE_ID`, `CONTENTFUL_DELIVERY_TOKEN`, `CONTENTFUL_ENVIRONMENT`) in the Vercel project settings.
4. Deploy.

## Content Model

This app consumes four Contentful content types:

- **Partner** — partner organizations with tier, capabilities, and profile info
- **Resource** — documents and guides, optionally linked to a partner
- **Announcement** — news items with rich text bodies
- **Page** — generic CMS-driven pages

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Contentful CDA via `contentful` SDK
- `@contentful/rich-text-react-renderer` for rich text
