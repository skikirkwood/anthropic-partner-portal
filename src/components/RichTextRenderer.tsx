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
      <code className="rounded bg-sand-200 px-1.5 py-0.5 text-sm font-mono">
        {text}
      </code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node, children) => (
      <p className="mb-4 leading-relaxed text-charcoal-light">{children}</p>
    ),
    [BLOCKS.HEADING_2]: (_node, children) => (
      <h2 className="mb-3 mt-8 text-2xl font-bold text-charcoal">
        {children}
      </h2>
    ),
    [BLOCKS.HEADING_3]: (_node, children) => (
      <h3 className="mb-2 mt-6 text-xl font-semibold text-charcoal">
        {children}
      </h3>
    ),
    [BLOCKS.HEADING_4]: (_node, children) => (
      <h4 className="mb-2 mt-4 text-lg font-semibold text-charcoal">
        {children}
      </h4>
    ),
    [BLOCKS.UL_LIST]: (_node, children) => (
      <ul className="mb-4 ml-6 list-disc space-y-1 text-charcoal-light">
        {children}
      </ul>
    ),
    [BLOCKS.OL_LIST]: (_node, children) => (
      <ol className="mb-4 ml-6 list-decimal space-y-1 text-charcoal-light">
        {children}
      </ol>
    ),
    [BLOCKS.QUOTE]: (_node, children) => (
      <blockquote className="mb-4 border-l-4 border-amber-500 pl-4 italic text-charcoal-muted">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-sand-200" />,
  },
};

export default function RichTextRenderer({ document }: { document: Document }) {
  return <div className="rich-text">{documentToReactComponents(document, options)}</div>;
}
