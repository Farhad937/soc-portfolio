import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";
import type { Components } from "react-markdown";

/**
 * Renders admin-authored Markdown safely.
 *
 * Security model, in order of what actually provides the guarantee:
 * 1. No `rehype-raw` plugin is used, anywhere. This means react-markdown
 *    never interprets embedded HTML tags as HTML — `<script>` typed
 *    into the editor renders as the literal text "<script>", not a
 *    live tag. This is the primary safety boundary, not an add-on.
 * 2. Markdown parses directly to React elements — there is no
 *    intermediate HTML string and no `dangerouslySetInnerHTML` call
 *    anywhere in this file or anywhere Rich Text is rendered.
 * 3. `rehype-sanitize` runs on top as defense-in-depth (strips
 *    `javascript:`/`data:` URLs, event-handler attributes, disallowed
 *    tags) in case a future change ever reintroduces raw HTML parsing.
 *
 * Styling reuses the project's existing Tailwind tokens — no new
 * typography system, matching the rest of the site's prose (`.card`
 * text, `text-muted`, `.tag`-adjacent link color).
 */
const components: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-text">{children}</strong>,
  em: ({ children }) => <em className="italic">{children}</em>,
  ul: ({ children }) => <ul className="mb-3 list-inside list-disc space-y-1 last:mb-0">{children}</ul>,
  ol: ({ children }) => <ol className="mb-3 list-inside list-decimal space-y-1 last:mb-0">{children}</ol>,
  li: ({ children }) => <li>{children}</li>,
  h1: ({ children }) => <h3 className="mb-2 mt-4 text-lg font-semibold text-text first:mt-0">{children}</h3>,
  h2: ({ children }) => <h3 className="mb-2 mt-4 text-base font-semibold text-text first:mt-0">{children}</h3>,
  h3: ({ children }) => <h4 className="mb-2 mt-4 text-sm font-semibold text-text first:mt-0">{children}</h4>,
  a: ({ href, children }) => {
    // Extra explicit belt-and-suspenders check, on top of
    // rehype-sanitize already stripping unsafe protocols — an
    // unrecognized/unsafe href renders as plain text, never a link.
    const safe = href && /^(https?:|mailto:|\/)/i.test(href);
    if (!safe) return <>{children}</>;
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline hover:text-accent-bright">
        {children}
      </a>
    );
  },
  // Inline code and fenced code blocks reuse the mono aesthetic
  // already established throughout the site (nav status ticker,
  // footer log line, tags) rather than introducing new styling.
  code: ({ className, children }) => {
    // react-markdown gives block-level code a `language-x` className
    // (from the fenced ```lang syntax); inline `code` spans have none.
    // That distinction is how this tells the two apart — no other
    // signal is reliable here.
    const isBlock = Boolean(className);
    if (isBlock) {
      return <code className="font-mono text-xs text-text">{children}</code>;
    }
    return (
      <code className="rounded border border-border-strong bg-bg-raised px-1.5 py-0.5 font-mono text-[0.85em] text-accent">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="card mb-3 overflow-x-auto p-4 last:mb-0">{children}</pre>
  ),
  blockquote: ({ children }) => (
    <blockquote className="mb-3 border-l-2 border-accent/40 pl-4 italic text-text-faint last:mb-0">
      {children}
    </blockquote>
  ),
};

export default function RichText({ content }: { content: string }) {
  if (!content?.trim()) return null;
  return (
    <div className="text-text-muted">
      <ReactMarkdown rehypePlugins={[rehypeSanitize]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
