"use client";

import { useRef, useState } from "react";
import { Bold, Italic, List, ListOrdered, Link2, Heading2, Eye, Pencil, Code, Terminal, Quote } from "lucide-react";
import RichText from "@/components/rich-text";

/**
 * A lightweight Markdown editor: a plain textarea plus a toolbar that
 * inserts Markdown syntax at the cursor, and a preview toggle that
 * renders through the exact same <RichText> component used publicly —
 * so what you see in preview is genuinely what will render, not an
 * approximation. Deliberately not a full WYSIWYG library (no Tiptap/
 * Slate/Quill) — the feature set needed (bold/italic/lists/links/
 * headings) doesn't justify that dependency weight.
 */
export default function RichTextEditor({
  name,
  defaultValue,
  rows = 6,
  label,
  hint,
}: {
  name: string;
  defaultValue?: string;
  rows?: number;
  label: string;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  const [mode, setMode] = useState<"write" | "preview">("write");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function wrapSelection(before: string, after: string = before) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const next = value.slice(0, selectionStart) + before + selected + after + value.slice(selectionEnd);
    setValue(next);
    // Restore focus and selection after the synchronous state update's
    // re-render — without the timeout, the browser hasn't repainted
    // the new value yet and setSelectionRange would target stale text.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart + before.length, selectionEnd + before.length);
    });
  }

  function insertLinePrefix(prefix: string) {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart } = el;
    const lineStart = value.lastIndexOf("\n", selectionStart - 1) + 1;
    const next = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(selectionStart + prefix.length, selectionStart + prefix.length);
    });
  }

  function insertCodeBlock() {
    const el = textareaRef.current;
    if (!el) return;
    const { selectionStart, selectionEnd } = el;
    const selected = value.slice(selectionStart, selectionEnd);
    const block = `\n\`\`\`\n${selected}\n\`\`\`\n`;
    const next = value.slice(0, selectionStart) + block + value.slice(selectionEnd);
    setValue(next);
    requestAnimationFrame(() => {
      el.focus();
      const cursor = selectionStart + 5; // land inside the fence, after "\n```\n"
      el.setSelectionRange(cursor, cursor + selected.length);
    });
  }

  const toolbarButtons = [
    { icon: Bold, title: "Bold", action: () => wrapSelection("**") },
    { icon: Italic, title: "Italic", action: () => wrapSelection("*") },
    { icon: Heading2, title: "Heading", action: () => insertLinePrefix("## ") },
    { icon: List, title: "Bulleted list", action: () => insertLinePrefix("- ") },
    { icon: ListOrdered, title: "Numbered list", action: () => insertLinePrefix("1. ") },
    { icon: Link2, title: "Link", action: () => wrapSelection("[", "](https://)") },
    { icon: Code, title: "Inline code", action: () => wrapSelection("`") },
    { icon: Terminal, title: "Code block", action: insertCodeBlock },
    { icon: Quote, title: "Quote", action: () => insertLinePrefix("> ") },
  ];

  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="font-mono text-xs uppercase tracking-wide text-text-faint">{label}</label>
        <div className="flex overflow-hidden rounded-md border border-border-strong">
          <button
            type="button"
            onClick={() => setMode("write")}
            className={`flex items-center gap-1 px-2 py-1 text-xs ${mode === "write" ? "bg-bg-raised text-text" : "text-text-faint"}`}
          >
            <Pencil className="h-3 w-3" /> Write
          </button>
          <button
            type="button"
            onClick={() => setMode("preview")}
            className={`flex items-center gap-1 px-2 py-1 text-xs ${mode === "preview" ? "bg-bg-raised text-text" : "text-text-faint"}`}
          >
            <Eye className="h-3 w-3" /> Preview
          </button>
        </div>
      </div>

      {mode === "write" ? (
        <>
          <div className="mb-1.5 flex gap-1 rounded-t-md border border-b-0 border-border-strong bg-bg-raised p-1">
            {toolbarButtons.map(({ icon: Icon, title, action }) => (
              <button
                key={title}
                type="button"
                title={title}
                onClick={action}
                className="rounded p-1.5 text-text-faint hover:bg-bg-surface hover:text-accent"
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            ))}
          </div>
          <textarea
            ref={textareaRef}
            name={name}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            rows={rows}
            className="w-full rounded-b-md border border-border-strong bg-bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent"
          />
        </>
      ) : (
        <div className="min-h-[6rem] rounded-md border border-border-strong bg-bg-surface px-3 py-2">
          <RichText content={value} />
        </div>
      )}

      {hint && <p className="mt-1 text-xs text-text-faint">{hint}</p>}
    </div>
  );
}
