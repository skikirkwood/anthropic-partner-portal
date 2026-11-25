"use client";

import { useRouter } from "next/navigation";
import type { Tier } from "@/lib/tiers";

interface UpgradeModalProps {
  requiredTier: string;
  currentTier: string;
  resourceTitle: string;
}

const tierColors: Record<string, { bg: string; text: string; ring: string }> = {
  Gold: { bg: "bg-amber-50", text: "text-amber-700", ring: "ring-amber-200" },
  Platinum: {
    bg: "bg-violet-50",
    text: "text-violet-700",
    ring: "ring-violet-200",
  },
};

export default function UpgradeModal({
  requiredTier,
  currentTier,
  resourceTitle,
}: UpgradeModalProps) {
  const router = useRouter();
  const colors = tierColors[requiredTier] ?? tierColors.Gold;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-cream-200">
        {/* Icon */}
        <div
          className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${colors.bg} ring-1 ${colors.ring}`}
        >
          <svg
            className={`h-7 w-7 ${colors.text}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
            />
          </svg>
        </div>

        {/* Title */}
        <h2 className="mt-5 text-center font-serif text-xl font-semibold text-ink">
          {requiredTier} Content
        </h2>

        {/* Description */}
        <p className="mt-3 text-center text-sm leading-relaxed text-ink-muted">
          <span className="font-medium text-ink">&ldquo;{resourceTitle}&rdquo;</span>{" "}
          requires{" "}
          <span className={`font-semibold ${colors.text}`}>
            {requiredTier}
          </span>{" "}
          tier access. Your current partner level is{" "}
          <span className="font-medium text-ink">{currentTier}</span>.
        </p>

        <p className="mt-2 text-center text-sm text-ink-muted">
          Contact your Anthropic partner manager to upgrade your partnership tier
          and unlock premium resources.
        </p>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3">
          <a
            href="mailto:partners@anthropic.com?subject=Partnership%20Tier%20Upgrade%20Request"
            className="inline-flex items-center justify-center rounded-lg bg-ink px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink/90"
          >
            Request upgrade
          </a>
          <button
            onClick={() => router.back()}
            className="inline-flex items-center justify-center rounded-lg border border-cream-200 bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-cream-50"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}
