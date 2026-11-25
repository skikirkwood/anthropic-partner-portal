/**
 * Visual indicator showing the production data source for a section.
 * Used to demonstrate that the portal integrates multiple systems —
 * partner data from Salesforce, content from Contentful.
 */

const sources = {
  salesforce: {
    label: "Salesforce Partner Portal",
    color: "text-blue-600 bg-blue-50 ring-blue-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M10.05 3.75a4.59 4.59 0 0 1 3.86 2.1 3.9 3.9 0 0 1 5.59 3.49 3.9 3.9 0 0 1-1.64 7.16H6.44a4.69 4.69 0 0 1-.69-9.33 4.59 4.59 0 0 1 4.3-3.42Z" />
      </svg>
    ),
  },
  contentful: {
    label: "Contentful CMS",
    color: "text-emerald-700 bg-emerald-50 ring-emerald-200",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
        <path d="M9.17 6a3.5 3.5 0 0 0-3.08 1.82A3 3 0 0 0 3 10.75v2.5a3 3 0 0 0 3.09 2.93A3.5 3.5 0 0 0 9.17 18h5.66a3.5 3.5 0 0 0 3.08-1.82A3 3 0 0 0 21 13.25v-2.5a3 3 0 0 0-3.09-2.93A3.5 3.5 0 0 0 14.83 6H9.17Z" />
      </svg>
    ),
  },
} as const;

type Source = keyof typeof sources;

export default function DataSourceBadge({ source }: { source: Source }) {
  const s = sources[source];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ring-1 ${s.color}`}
    >
      {s.icon}
      {s.label}
    </span>
  );
}
