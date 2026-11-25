"use client";

import {
  useContentfulLiveUpdates,
  useContentfulInspectorMode,
} from "@contentful/live-preview/react";
import Link from "next/link";
import AnthropicLogo from "@/components/AnthropicLogo";

interface ValueItem {
  title: string;
  description: string;
}
interface StatItem {
  value: string;
  label: string;
}
interface MilestoneItem {
  year: string;
  title: string;
  description: string;
}

export default function AboutPageLive({ rawEntry }: { rawEntry: any }) {
  const entry = useContentfulLiveUpdates(rawEntry);
  const inspectorProps = useContentfulInspectorMode({
    entryId: entry.sys.id,
  });
  const f = entry.fields;

  const heroLabel = f.heroLabel ?? "About the Partner Network";
  const heroHeadline =
    f.heroHeadline ?? "Building the future of AI — together.";
  const heroDescription = f.heroDescription ?? "";
  const missionHeading = f.missionHeading ?? "Our mission";
  const missionBody = f.missionBody ?? "";
  const missionQuote = f.missionQuote ?? "";
  const missionQuoteAttribution =
    f.missionQuoteAttribution ?? "Anthropic Partnerships Team";
  const valuesHeading = f.valuesHeading ?? "What we stand for";
  const valuesDescription = f.valuesDescription ?? "";
  const values: ValueItem[] = Array.isArray(f.values) ? f.values : [];
  const stats: StatItem[] = Array.isArray(f.stats) ? f.stats : [];
  const milestonesHeading = f.milestonesHeading ?? "Our journey";
  const milestonesDescription = f.milestonesDescription ?? "";
  const milestones: MilestoneItem[] = Array.isArray(f.milestones)
    ? f.milestones
    : [];
  const ctaHeading = f.ctaHeading ?? "Ready to partner with Anthropic?";
  const ctaDescription = f.ctaDescription ?? "";
  const ctaPrimaryText = f.ctaPrimaryText ?? "Explore partners";
  const ctaPrimaryLink = f.ctaPrimaryLink ?? "/partners";
  const ctaSecondaryText = f.ctaSecondaryText ?? "Visit anthropic.com";
  const ctaSecondaryLink = f.ctaSecondaryLink ?? "https://www.anthropic.com";

  const missionParagraphs = missionBody
    .split("\n")
    .filter((p: string) => p.trim());

  return (
    <>
      {/* Hero */}
      <section className="border-b border-cream-200">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-28">
          <p
            className="text-sm font-medium tracking-wide text-tawny"
            {...inspectorProps({ fieldId: "heroLabel" })}
          >
            {heroLabel}
          </p>
          <h1
            className="mt-4 max-w-4xl font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl"
            {...inspectorProps({ fieldId: "heroHeadline" })}
          >
            {heroHeadline}
          </h1>
          <p
            className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted"
            {...inspectorProps({ fieldId: "heroDescription" })}
          >
            {heroDescription}
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <div>
            <h2
              className="font-serif text-2xl font-semibold text-ink"
              {...inspectorProps({ fieldId: "missionHeading" })}
            >
              {missionHeading}
            </h2>
            <div {...inspectorProps({ fieldId: "missionBody" })}>
              {missionParagraphs.map((p: string, i: number) => (
                <p
                  key={i}
                  className="mt-4 text-lg leading-relaxed text-ink-light"
                >
                  {p}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <div className="rounded-xl border border-cream-200 bg-white p-8">
              <AnthropicLogo className="mb-4 h-6 w-6 text-ink" />
              <blockquote
                className="font-serif text-xl leading-relaxed text-ink"
                {...inspectorProps({ fieldId: "missionQuote" })}
              >
                &ldquo;{missionQuote}&rdquo;
              </blockquote>
              <p
                className="mt-4 text-sm text-ink-muted"
                {...inspectorProps({ fieldId: "missionQuoteAttribution" })}
              >
                — {missionQuoteAttribution}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      {stats.length > 0 && (
        <section className="border-y border-cream-200 bg-white">
          <div
            className="mx-auto max-w-6xl px-6 py-16"
            {...inspectorProps({ fieldId: "stats" })}
          >
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
              {stats.map((stat: StatItem) => (
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
          <h2
            className="font-serif text-2xl font-semibold text-ink"
            {...inspectorProps({ fieldId: "valuesHeading" })}
          >
            {valuesHeading}
          </h2>
          <p
            className="mt-3 text-ink-muted"
            {...inspectorProps({ fieldId: "valuesDescription" })}
          >
            {valuesDescription}
          </p>
        </div>
        {values.length > 0 && (
          <div
            className="mt-12 grid gap-8 sm:grid-cols-2"
            {...inspectorProps({ fieldId: "values" })}
          >
            {values.map((value: ValueItem) => (
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
          <h2
            className="font-serif text-2xl font-semibold text-ink"
            {...inspectorProps({ fieldId: "milestonesHeading" })}
          >
            {milestonesHeading}
          </h2>
          <p
            className="mt-3 text-ink-muted"
            {...inspectorProps({ fieldId: "milestonesDescription" })}
          >
            {milestonesDescription}
          </p>
          {milestones.length > 0 && (
            <div
              className="mt-12 space-y-0"
              {...inspectorProps({ fieldId: "milestones" })}
            >
              {milestones.map((milestone: MilestoneItem, i: number) => (
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
          <h2
            className="font-serif text-2xl font-semibold text-ink"
            {...inspectorProps({ fieldId: "ctaHeading" })}
          >
            {ctaHeading}
          </h2>
          <p
            className="mx-auto mt-3 max-w-lg text-ink-muted"
            {...inspectorProps({ fieldId: "ctaDescription" })}
          >
            {ctaDescription}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href={ctaPrimaryLink}
              className="rounded-md bg-ink px-5 py-2.5 text-sm font-medium text-cream-50 transition-colors hover:bg-ink-light"
              {...inspectorProps({ fieldId: "ctaPrimaryText" })}
            >
              {ctaPrimaryText}
            </Link>
            <a
              href={ctaSecondaryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-cream-200 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-cream-300 hover:bg-cream-50"
              {...inspectorProps({ fieldId: "ctaSecondaryText" })}
            >
              {ctaSecondaryText}
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
