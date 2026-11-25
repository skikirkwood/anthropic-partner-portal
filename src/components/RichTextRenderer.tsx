import {
  documentToReactComponents,
  type Options,
} from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, type Document } from "@contentful/rich-text-types";
import type { ReactNode } from "react";

const options: Options = {
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => (
      <strong className="font-semibold">{text}</strong>
    ),
    [MARKS.ITALIC]: (text: ReactNode) => <em>{text}</em>,
    [MARKS.CODE]: (text: ReactNode) => (
      <code className="rounded bg-cream-200 px-1.5 py-0.5 text-sm font-mono">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mb-4 leading-relaxed text-ink-light">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="mb-3 mt-8 font-serif text-2xl font-semibold text-ink">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="mb-2 mt-6 font-serif text-xl font-semibold text-ink">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="mb-2 mt-4 font-serif text-lg font-semibold text-ink">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-ink-light">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-ink-light">
        {children}
      </ol>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="mb-4 border-l-2 border-cream-300 pl-4 italic text-ink-muted">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-cream-200" />,
  },
};

export default function RichTextRenderer({ document }: { document: Document }) {
  return <div className="rich-text">{documentToReactComponents(document, options)}</div>;
}
