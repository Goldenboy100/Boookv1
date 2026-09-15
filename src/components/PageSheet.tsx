import type { Book, Page } from "../lib/types";
import { fontStack } from "../lib/typography";
import { languageByCode } from "../lib/languages";
import { renderManuscript, renderInlineText } from "../lib/markdown";
import { pageMeta } from "../lib/pages";

interface PageSheetProps {
  book: Book;
  page: Page;
  width?: number;
  showFolio?: number;
  className?: string;
  plain?: boolean;
}

const MARGIN = { narrow: 2.4, normal: 3.4, wide: 4.6 } as const;

export default function PageSheet({ book, page, width, showFolio, className = "", plain = false }: PageSheetProps) {
  const lang = languageByCode(book.language);
  const inter = book.interior;
  const bodyFont = fontStack(inter.bodyFont);
  const baseFs = 17 * inter.fontScale * page.fontScale;
  const marginEm = MARGIN[inter.margin];

  const style: React.CSSProperties = {
    background: plain ? "transparent" : "#f4ede0",
    color: "#221e17",
    fontFamily: bodyFont,
    direction: lang.dir,
    fontSize: baseFs,
    lineHeight: inter.lineHeight,
    padding: plain ? "0" : `${marginEm}em ${marginEm * 0.9}em`,
    textAlign: inter.justify && lang.dir === "ltr" ? "justify" : "start",
    width: width ? `${width}px` : undefined,
    maxWidth: "100%",
    borderRadius: plain ? 0 : 3,
    boxShadow: plain ? "none" : "0 24px 50px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.15)",
    position: "relative",
  };

  const meta = pageMeta(page.kind);
  const body = page.text.trim() ? renderManuscript(page.text, inter.sceneBreak) : null;
  const dropcapClass = inter.dropCaps && page.kind === "chapter" ? "dropcap" : "";

  const chapterLabel = () => {
    const n = book.pages.filter((p) => p.kind === "chapter").indexOf(page) + 1;
    return n > 0 ? `Chapter ${n}` : "";
  };

  const renderBody = () => {
    switch (page.kind) {
      case "half-title":
        return (
          <div className="flex min-h-[40vh] items-center justify-center text-center">
            <div style={{ fontSize: "1.7em", fontWeight: 500 }}>{book.title}</div>
          </div>
        );
      case "title":
        return (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: "2.6em", lineHeight: 1.08, fontWeight: 500 }}>{book.title}</div>
            {book.subtitle && <div style={{ fontSize: "1.15em", fontStyle: "italic", marginTop: "0.6em", opacity: 0.85 }}>{book.subtitle}</div>}
            <div style={{ width: "5em", height: 3, borderTop: "1px solid #a9833a", borderBottom: "1px solid #a9833a", margin: "2em auto" }} />
            <div style={{ fontSize: "1.05em", letterSpacing: "0.14em", textTransform: "uppercase" }}>{book.author}</div>
          </div>
        );
      case "copyright":
        return (
          <div style={{ fontSize: "0.82em", lineHeight: 1.7, color: "#6d6353" }}>
            <p style={{ textIndent: 0 }}>
              <strong>{book.title}</strong>
              {book.subtitle ? ` — ${book.subtitle}` : ""}
              <br />
              {book.author}
            </p>
            <p style={{ textIndent: 0 }}>
              First edition · {new Date().getFullYear()}
              <br />
              Language: {lang.name} ({lang.code})
              <br />
              Set in {bodyFont.split(",")[0].replace(/"/g, "")}.
              <br />
              Published with Quire — Book Studio.
            </p>
            <p style={{ textIndent: 0 }}>All rights reserved. No part of this book may be reproduced in any form without permission of the author.</p>
          </div>
        );
      case "dedication":
        return (
          <div className="flex min-h-[36vh] items-center justify-center text-center">
            <div style={{ fontStyle: "italic", fontSize: "1.15em" }}>{page.text.trim() || "For someone who mattered."}</div>
          </div>
        );
      case "epigraph":
        return (
          <div className="flex min-h-[36vh] items-end justify-end">
            <blockquote style={{ fontStyle: "italic", fontSize: "1.1em", maxWidth: "80%", border: "none", padding: 0, margin: 0, textAlign: lang.dir === "rtl" ? "left" : "right" }}>
              {page.text.trim() || "\u201C A line to set the tone. \u201D"}
            </blockquote>
          </div>
        );
      case "contents":
        return (
          <div>
            <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: "1.8em", fontWeight: 500, marginBottom: "1em" }}>Contents</h1>
            <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {book.pages
                .filter((p) => ["part", "chapter", "foreword", "preface", "introduction", "epilogue", "appendix", "glossary", "acknowledgements", "about"].includes(p.kind))
                .map((p) => (
                  <li key={p.id} style={{ display: "flex", gap: "0.6em", alignItems: "baseline", padding: "0.35em 0", borderBottom: "1px dotted rgba(109,99,83,0.4)" }}>
                    <span style={{ fontWeight: p.kind === "part" ? 700 : 400 }}>{p.title || pageMeta(p.kind).label}</span>
                    <span style={{ flex: 1 }} />
                    <span style={{ opacity: 0.6, fontFamily: '"DM Mono", monospace', fontSize: "0.85em" }}>{p.kind === "part" ? "\u2022" : ""}</span>
                  </li>
                ))}
            </ol>
          </div>
        );
      case "part":
        return (
          <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
            <div style={{ fontSize: "0.9em", letterSpacing: "0.3em", textTransform: "uppercase", opacity: 0.7 }}>Part</div>
            <div style={{ fontFamily: '"Fraunces", serif', fontSize: "2.2em", fontWeight: 500, marginTop: "0.4em" }}>{page.title || "Untitled part"}</div>
            {body && <div className="mt-6 max-w-[34em] text-center opacity-85">{body}</div>}
          </div>
        );
      case "chapter":
        return (
          <div className={dropcapClass}>
            {chapterLabel() && (
              <div style={{ fontSize: "0.82em", letterSpacing: "0.26em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.5em" }}>{chapterLabel()}</div>
            )}
            <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: "1.9em", fontWeight: 500, lineHeight: 1.12, marginBottom: "0.9em" }}>{page.title || "Untitled chapter"}</h1>
            {body}
          </div>
        );
      default:
        return (
          <div>
            <div style={{ fontSize: "0.8em", letterSpacing: "0.26em", textTransform: "uppercase", opacity: 0.6, marginBottom: "0.5em" }}>{meta.label}</div>
            {page.title && <h1 style={{ fontFamily: '"Fraunces", serif', fontSize: "1.7em", fontWeight: 500, marginBottom: "0.8em" }}>{page.title}</h1>}
            {body}
            {!body && <p style={{ opacity: 0.45, fontStyle: "italic", textIndent: 0 }}>{meta.hint}</p>}
          </div>
        );
    }
  };

  return (
    <article className={`relative ${className}`} style={style}>
      {inter.folio === "top" && showFolio != null && (
        <div className="mb-6 text-center font-mono text-[0.7em] tracking-widest opacity-50">{showFolio}</div>
      )}
      {renderBody()}
      {inter.folio === "bottom" && showFolio != null && (
        <div className="mt-10 text-center font-mono text-[0.7em] tracking-widest opacity-50">{showFolio}</div>
      )}
    </article>
  );
}

export function InlineTitle({ text }: { text: string }) {
  return <>{renderInlineText(text)}</>;
}
