const tierStyles: Record<string, string> = {
  Gold: "bg-amber-50 text-amber-800 ring-amber-200",
  Silver: "bg-slate-50 text-slate-600 ring-slate-200",
  Bronze: "bg-orange-50 text-orange-700 ring-orange-200",
};

export default function TierBadge({ tier }: { tier: string }) {
  const classes = tierStyles[tier] ?? tierStyles.Bronze;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${classes}`}
    >
      {tier}
    </span>
  );
}
