import type { Metadata } from "next";
import { draftMode } from "next/headers";
import Link from "next/link";
import AnthropicLogo from "@/components/AnthropicLogo";
import {
  getAboutPage,
  getRawAboutPageEntry,
  type AboutPageValue,
  type AboutPageStat,
  type AboutPageMilestone,
} from "@/lib/contentful";
import AboutPageLive from "./AboutPageLive";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "About | Claude Partner Hub",
  description:
    "The mission, values, and story behind the Claude Partner Network.",
};

export default async function AboutPage() {
  const { isEnabled: preview } = draftMode();

  if (preview) {
    const rawEntry = await getRawAboutPageEntry(true);
    if (rawEntry) {
      return <AboutPageLive rawEntry={rawEntry} />;
    }
  }

  const about = await getAboutPage(preview);

  // Fallbacks
  const heroLabel = about?.heroLabel ?? "About the Partner Network";
  const heroHeadline =
    about?.heroHeadline ??
    "Building the future of AI — together with the organizations that know their industries best.";
  const heroDescription =
    about?.heroDescription ??
    "The Claude Partner Network connects Anthropic with the world's leading consulting firms, systems integrators, and technology companies to bring safe, reliable AI to every enterprise.";
  const missionHeading = about?.missionHeading ?? "Our mission";
  const missionBody =
    about?.missionBody ??
    "AI will reshape every industry. The question is whether that transformation happens thoughtfully — with safety, transparency, and genuine expertise — or haphazardly.\n\nThe Claude Partner Network exists because Anthropic can't do this alone. Our partners bring decades of domain experience in healthcare, financial services, government, and beyond. We bring frontier AI models and the research to make them trustworthy. Together, we deploy Claude where it matters most.";
  const missionQuote =
    about?.missionQuote ??
    "The best AI deployments combine deep technical capability with deep domain understanding. That's what this network is built for.";
  const missionQuoteAttribution =
    about?.missionQuoteAttribution ?? "Anthropic Partnerships Team";
  const valuesHeading = about?.valuesHeading ?? "What we stand for";
  const valuesDescription =
    about?.valuesDescription ??
    "The principles that guide every partnership in the Claude network.";
  const values: AboutPageValue[] =
    about?.values && about.values.length > 0
      ? about.values
      : [
          {
            title: "Safety-first deployment",
            description:
              "Every partner integration upholds Anthropic's commitment to responsible AI. We provide guardrails, best practices, and review processes so Claude is deployed safely at every scale.",
          },
          {
            title: "Shared expertise",
            description:
              "Partners bring deep industry and domain knowledge; Anthropic brings frontier AI research. Together we build solutions neither could deliver alone.",
          },
          {
            title: "Long-term thinking",
            description:
              "We invest in partnerships that compound over years, not quarters. Enablement, co-selling, and technical depth grow with every engagement.",
          },
          {
            title: "Transparency",
            description:
              "Partners get direct access to product roadmaps, research insights, and engineering support. No black boxes — we build trust through openness.",
          },
        ];
  const stats: AboutPageStat[] =
    about?.stats && about.stats.length > 0
      ? about.stats
      : [
          { value: "50+", label: "Global partners" },
          { value: "12", label: "Countries" },
          { value: "500+", label: "Enterprise deployments" },
          { value: "98%", label: "Partner retention" },
        ];
  const milestonesHeading = about?.milestonesHeading ?? "Our journey";
  const milestonesDescription =
    about?.milestonesDescription ??
    "Key moments in the Claude Partner Network's growth.";
  const milestones: AboutPageMilestone[] =
    about?.milestones && about.milestones.length > 0
      ? about.milestones
      : [
          {
            year: "2023",
            title: "Partner program launch",
            description:
              "Anthropic introduces the Claude Partner Network with founding partners across consulting, systems integration, and technology.",
          },
          {
            year: "2024",
            title: "Global expansion",
            description:
              "The network grows to 30+ partners spanning North America, Europe, and Asia-Pacific, with dedicated enablement and co-selling motions.",
          },
          {
            year: "2025",
            title: "Enterprise acceleration",
            description:
              "Claude 4 launches alongside expanded partner tiers, the Partner Hub portal, and deepened technical enablement for enterprise-scale deployments.",
          },
        ];
  const ctaHeading = about?.ctaHeading ?? "Ready to partner with Anthropic?";
  const ctaDescription =
    about?.ctaDescription ??
    "Whether you're a global consultancy or a specialized technology firm, the Claude Partner Network has a place for you.";
  const ctaPrimaryText = about?.ctaPrimaryText ?? "Explore partners";
  const ctaPrimaryLink = about?.ctaPrimaryLink ?? "/partners";
  const ctaSecondaryText = about?.ctaSecondaryText ?? "Visit anthropic.com";
  const ctaSecondaryLink =
    about?.ctaSecondaryLink ?? "https://www.anthropic.com";

  const missionParagraphs = missionBody.split("\n").filter((p) => p.trim());

  return (
    <>
      {/* Hero */}
      <section className="border-b border-cream-200">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p className="text-sm font-medium tracking-wide text-tawny">
            {heroLabel}
          </p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
            {heroHeadline}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2 className="font-serif text-2xl font-semibold text-ink">
              {missionHeading}
            </h2>
            {missionParagraphs.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-lg leading-relaxed text-ink-light"
              >
                {p}
              </p>
            ))}
          </div>
          <div className="flex items-center">
            <div className="rounded-xl border border-cream-200 bg-white p-8">
              <AnthropicLogo className="mb-4 h-6 w-6 text-ink" />
              <blockquote className="font-serif text-xl leading-relaxed text-ink">
                &ldquo;{missionQuote}&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-ink-muted">
                — {missionQuoteAttribution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="border-y border-cream-200 bg-white">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="font-serif text-4xl font-semibold text-ink">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-sm text-ink-muted">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Values */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-2xl">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {valuesHeading}
          </h2>
          <p className="mt-3 text-ink-muted">{valuesDescription}</p>
        </div>
        {values.length > 0 && (
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-lg border border-cream-200 bg-white p-6"
              >
                <h3 className="font-serif text-lg font-semibold text-ink">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-ink-light">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Timeline */}
      <section className="border-t border-cream-200">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {milestonesHeading}
          </h2>
          <p className="mt-3 text-ink-muted">{milestonesDescription}</p>
          {milestones.length > 0 && (
            <div className="mt-12 space-y-0">
              {milestones.map((milestone, i) => (
                <div
                  key={milestone.year}
                  className="relative flex gap-6 pb-10 last:pb-0"
                >
                  {i < milestones.length - 1 && (
                    <div className="absolute left-[19px] top-10 bottom-0 w-px bg-cream-200" />
                  )}
                  <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-cream-200 bg-white">
                    <div className="h-2.5 w-2.5 rounded-full bg-tawny" />
                  </div>
                  <div className="pt-1.5">
                    <span className="text-sm font-medium text-tawny">
                      {milestone.year}
                    </span>
                    <h3 className="mt-1 font-serif text-lg font-semibold text-ink">
                      {milestone.title}
                    </h3>
                    <p className="mt-2 leading-relaxed text-ink-light">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-cream-200 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center">
          <h2 className="font-serif text-2xl font-semibold text-ink">
            {ctaHeading}
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-ink-muted">
            {ctaDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={ctaPrimaryLink}
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
            >
              {ctaPrimaryText}
            </Link>
            <a
              href={ctaSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-cream-200 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-cream-300 hover:bg-cream-50"
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
