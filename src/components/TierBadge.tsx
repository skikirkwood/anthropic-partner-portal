const tierStyles: Record<string, string> = {
  Gold: "bg-amber-100 text-amber-800 ring-amber-300",
  Silver: "bg-slate-100 text-slate-700 ring-slate-300",
  Bronze: "bg-orange-100 text-orange-800 ring-orange-300",
};

export default function TierBadge({ tier }: { tier: string }) {
  const classes = tierStyles[tier] ?? tierStyles.Bronze;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${classes}`}
    >
      {tier}
    </span>
  );
}
