import type { ReactNode } from "react";

/**
 * A tiny, dependency-free manuscript formatter.
 *
 * Block syntax (separated by blank lines):
 *   plain text        -> paragraph
 *   ## text           -> section heading
 *   > text            -> epigraph / quotation
 *   --- or ***        -> scene break
 *   - item            -> list item
 *
 * Inline: **bold**, *italic*, _italic_.
 */

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(text))) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("**")) {
      nodes.push(<strong key={`${keyBase}-b${i}`}>{tok.slice(2, -2)}</strong>);
    } else {
      const inner = tok.startsWith("_") ? tok.slice(1, -1) : tok.slice(1, -1);
      nodes.push(<em key={`${keyBase}-i${i}`}>{inner}</em>);
    }
    last = m.index + tok.length;
    i++;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export function renderInlineText(text: string, keyBase = "i"): ReactNode[] {
  return renderInline(text, keyBase);
}

export interface SceneBreakProps {
  style: "ornament" | "stars" | "rule" | "space";
}

export function SceneBreak({ style }: SceneBreakProps) {
  if (style === "space") return <div style={{ height: "1.4em" }} aria-hidden />;
  if (style === "rule")
    return (
      <div className="flex justify-center py-3" aria-hidden>
        <span style={{ width: "38%", height: 1, background: "currentColor", opacity: 0.4 }} />
      </div>
    );
  if (style === "stars")
    return (
      <div className="text-center py-3 tracking-[0.6em] opacity-70" aria-hidden>
        * * *
      </div>
    );
  return (
    <div className="text-center py-3 text-[1.3em] leading-none opacity-80" aria-hidden>
      ❦
    </div>
  );
}

export function renderManuscript(
  text: string,
  sceneStyle: "ornament" | "stars" | "rule" | "space",
): ReactNode[] {
  const blocks = text.replace(/\r\n/g, "\n").split(/\n\s*\n/);
  const out: ReactNode[] = [];
  blocks.forEach((raw, idx) => {
    const block = raw.trim();
    if (!block) return;
    const key = `blk${idx}`;
    if (/^(---|\*\*\*)$/.test(block)) {
      out.push(<SceneBreak key={key} style={sceneStyle} />);
    } else if (block.startsWith("## ")) {
      out.push(<h2 key={key}>{renderInlineText(block.slice(3), key)}</h2>);
    } else if (block.startsWith("> ")) {
      out.push(
        <blockquote key={key}>
          {block
            .split("\n")
            .map((l) => l.replace(/^>\s?/, ""))
            .join(" ")}
        </blockquote>,
      );
    } else if (/^- /.test(block)) {
      const items = block.split("\n").map((l) => l.replace(/^-\s?/, ""));
      out.push(
        <ul key={key} className="list-disc ps-6">
          {items.map((it, i) => (
            <li key={`${key}-${i}`}>{renderInlineText(it, `${key}-${i}`)}</li>
          ))}
        </ul>,
      );
    } else {
      out.push(<p key={key}>{renderInlineText(block, key)}</p>);
    }
  });
  if (out.length === 0) out.push(<p key="empty" style={{ opacity: 0.5 }}>(empty page)</p>);
  return out;
}

export function countWords(text: string): number {
  const t = text.trim();
  return t ? t.split(/\s+/).length : 0;
}
