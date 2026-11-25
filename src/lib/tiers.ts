// ---------------------------------------------------------------------------
// Tier hierarchy and domain-to-tier mapping for content gating
// ---------------------------------------------------------------------------

export const TIER_HIERARCHY = ["Silver", "Gold", "Platinum"] as const;
export type Tier = (typeof TIER_HIERARCHY)[number];

/**
 * Map email domains to partner tiers.
 * anthropic.com gets Platinum (full access for internal staff).
 */
const DOMAIN_TIER_MAP: Record<string, Tier> = {
  "anthropic.com": "Platinum",
  "deloitte.com": "Platinum",
  "accenture.com": "Gold",
  "mckinsey.com": "Gold",
  "wipro.com": "Silver",
  "slalom.com": "Silver",
  "thoughtworks.com": "Silver",
};

/** Extract the domain from an email address. */
function domainFromEmail(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

/** Resolve the tier for a given email. Defaults to Silver if unknown. */
export function getTierForEmail(email: string): Tier {
  const domain = domainFromEmail(email);
  return DOMAIN_TIER_MAP[domain] ?? "Silver";
}

/** Return the numeric rank of a tier (higher = more access). */
function tierRank(tier: string): number {
  const idx = TIER_HIERARCHY.indexOf(tier as Tier);
  return idx >= 0 ? idx : 0; // unknown tiers treated as Silver
}

/**
 * Check whether a user's tier meets or exceeds the required tier.
 * If `requiredTier` is undefined/null, the resource is open to all.
 */
export function hasAccess(userTier: string, requiredTier?: string | null): boolean {
  if (!requiredTier) return true;
  return tierRank(userTier) >= tierRank(requiredTier);
}

/**
 * Return the next tier up from the user's current tier, or null if
 * they're already at the highest tier.
 */
export function nextTierUp(currentTier: string): Tier | null {
  const idx = TIER_HIERARCHY.indexOf(currentTier as Tier);
  if (idx < 0 || idx >= TIER_HIERARCHY.length - 1) return null;
  return TIER_HIERARCHY[idx + 1];
}
