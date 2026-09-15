import JSZip from "jszip";
import { createElement, Fragment } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Book } from "./types";
import { languageByCode } from "./languages";
import { fontStack } from "./typography";
import { renderManuscript } from "./markdown";

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function slugify(s: string): string {
  return (
    s
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "book"
  );
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ------------------------------- Markdown ------------------------------- */

export function bookToMarkdown(book: Book): string {
  const lang = languageByCode(book.language);
  const lines: string[] = [];
  lines.push(`<!-- ${book.title} — ${book.author} -->`);
  lines.push("");
  lines.push(`# ${book.title}`);
  if (book.subtitle) lines.push(`### ${book.subtitle}`);
  if (book.author) lines.push(`*${book.author}*`);
  lines.push("");
  if (book.description) {
    lines.push("> " + book.description);
    lines.push("");
  }
  lines.push(`<!-- language: ${lang.name} (${lang.code}) -->`);
  lines.push("");
  for (const p of book.pages) {
    if (p.kind === "contents" || p.kind === "blank") continue;
    if (p.title) lines.push(`## ${p.title}`);
    if (p.text.trim()) {
      lines.push(p.text.trim());
      lines.push("");
    }
  }
  return lines.join("\n");
}

export function exportMarkdown(book: Book) {
  const md = bookToMarkdown(book);
  downloadBlob(new Blob([md], { type: "text/markdown;charset=utf-8" }), `${slugify(book.title)}.md`);
}

/* --------------------------------- JSON -------------------------------- */

export function exportBookJson(book: Book) {
  const data = JSON.stringify(book, null, 2);
  downloadBlob(new Blob([data], { type: "application/json" }), `${slugify(book.title)}.quire.json`);
}

export function exportLibraryJson(books: Book[]) {
  const data = JSON.stringify({ app: "quire", version: 1, books }, null, 2);
  downloadBlob(new Blob([data], { type: "application/json" }), "quire-library-backup.json");
}

export function parseLibrary(text: string): Book[] | null {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) return parsed as Book[];
    if (parsed && Array.isArray(parsed.books)) return parsed.books as Book[];
    if (parsed && parsed.id && Array.isArray(parsed.pages)) return [parsed as Book];
    return null;
  } catch {
    return null;
  }
}

/* --------------------------------- EPUB -------------------------------- */

function manuscriptHtml(book: Book, text: string): string {
  const nodes = renderManuscript(text, book.interior.sceneBreak);
  return renderToStaticMarkup(createElement(Fragment, null, nodes));
}

function coverSvg(book: Book): string {
  const t = escapeXml(book.title || "Untitled");
  const a = escapeXml(book.author || "");
  const s = escapeXml(book.subtitle || "");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 900" width="600" height="900">
  <defs><style>
    .t{font-family:${fontStack(book.cover.titleFont)};fill:#15141a}
    .a{font-family:Georgia,serif;fill:#5a5347}
  </style></defs>
  <rect width="600" height="900" fill="#f4ede0"/>
  <rect x="36" y="36" width="528" height="828" fill="none" stroke="#c9a24b" stroke-width="2"/>
  <text x="300" y="330" text-anchor="middle" class="t" font-size="64">${t}</text>
  ${s ? `<text x="300" y="400" text-anchor="middle" class="a" font-size="26" font-style="italic">${s}</text>` : ""}
  <line x1="220" y1="470" x2="380" y2="470" stroke="#c9a24b" stroke-width="2"/>
  ${a ? `<text x="300" y="540" text-anchor="middle" class="a" font-size="24">${a}</text>` : ""}
</svg>`;
}

export async function exportEpub(book: Book) {
  const zip = new JSZip();
  zip.file("mimetype", "application/epub+zip", { compression: "STORE" });

  const meta = zip.folder("META-INF");
  meta?.file(
    "container.xml",
    `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`,
  );

  const oebps = zip.folder("OEBPS");
  const lang = languageByCode(book.language);

  oebps?.file(
    "style.css",
    `body{font-family:Georgia,serif;line-height:1.6;margin:1.2em}
h1,h2{font-weight:600;line-height:1.2}
blockquote{margin:1em 0;padding-left:1em;border-left:2px solid #999;font-style:italic;color:#555}
.scene{text-align:center;margin:1.4em 0;letter-spacing:.4em}
.cover svg{width:100%;height:auto}`,
  );

  // Pages -> chapters
  const chapters: { id: string; href: string; title: string }[] = [];
  let idx = 0;
  const structural = new Set(["title", "dedication", "epigraph", "copyright", "about", "acknowledgements", "colophon", "glossary", "appendix"]);

  // Cover
  oebps?.file("cover.xhtml", `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang.code}" lang="${lang.code}">
<head><meta charset="utf-8"/><title>${escapeXml(book.title)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body class="cover">${coverSvg(book)}</body></html>`);
  chapters.push({ id: "cover", href: "cover.xhtml", title: book.title || "Cover" });

  for (const p of book.pages) {
    if (p.kind === "contents" || p.kind === "blank") continue;
    const hasBody = p.text.trim().length > 0;
    if (!hasBody && !structural.has(p.kind) && !p.title) continue;
    idx++;
    const fname = `ch${idx}.xhtml`;
    const body = hasBody ? manuscriptHtml(book, p.text) : "";
    const heading = p.title ? `<h1>${escapeXml(p.title)}</h1>` : "";
    oebps?.file(
      fname,
      `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${lang.code}" lang="${lang.code}">
<head><meta charset="utf-8"/><title>${escapeXml(p.title || `Page ${idx}`)}</title><link rel="stylesheet" type="text/css" href="style.css"/></head>
<body dir="${lang.dir}">${heading}${body}</body></html>`,
    );
    chapters.push({ id: `ch${idx}`, href: fname, title: p.title || p.kind });
  }

  const navItems = chapters
    .map((c) => `<li><a href="${c.href}">${escapeXml(c.title)}</a></li>`)
    .join("\n      ");
  oebps?.file(
    "nav.xhtml",
    `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang.code}" lang="${lang.code}">
<head><meta charset="utf-8"/><title>Contents</title></head>
<body>
  <nav epub:type="toc" id="toc"><h1>Contents</h1>
    <ol>
      ${navItems}
    </ol>
  </nav>
</body></html>`,
  );

  const manifest = chapters
    .map((c) => `<item id="${c.id}" href="${c.href}" media-type="application/xhtml+xml"/>`)
    .join("\n    ");
  const spine = chapters.map((c) => `<itemref idref=\"${c.id}\"/>`).join("\n    ");

  oebps?.file(
    "content.opf",
    `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="uid" xml:lang="${lang.code}">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="uid">urn:uuid:${book.id}</dc:identifier>
    <dc:title>${escapeXml(book.title || "Untitled")}</dc:title>
    <dc:creator>${escapeXml(book.author || "Unknown")}</dc:creator>
    <dc:language>${lang.code}</dc:language>
    ${book.subtitle ? `<dc:subtitle>${escapeXml(book.subtitle)}</dc:subtitle>` : ""}
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, "Z")}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="style.css" media-type="text/css"/>
    ${manifest}
  </manifest>
  <spine>
    ${spine}
  </spine>
</package>`,
  );

  const blob = await zip.generateAsync({ type: "blob", mimeType: "application/epub+zip" });
  downloadBlob(blob, `${slugify(book.title)}.epub`);
}
