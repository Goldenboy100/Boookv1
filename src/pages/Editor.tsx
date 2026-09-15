import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useBooks } from "../lib/books";
import { useAuth } from "../lib/auth";
import Cover from "../components/Cover";
import PageSheet from "../components/PageSheet";
import ExportMenu from "../components/ExportMenu";
import { movePage, duplicatePage, removePage, updatePage } from "../lib/helpers";
import { PAGE_CATALOG, pageMeta, groupLabel } from "../lib/pages";
import { LANGUAGES, languageByCode } from "../lib/languages";
import { TITLE_FONTS, BODY_FONTS, fontStack } from "../lib/typography";
import { COVER_TEMPLATES, PALETTES, PATTERNS } from "../lib/covers";
import { makePage } from "../lib/store";
import { countWords } from "../lib/markdown";
import type { Page, PageKind } from "../lib/types";
import {
  ArrowLeft, Plus, Trash2, Copy, ChevronUp, ChevronDown, Eye, Pencil,
  Type, AlignLeft, PanelRight, Minus, RotateCcw, Image as ImageIcon, X,
} from "lucide-react";

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));

export default function Editor() {
  const { id = "" } = useParams();
  const { getBook, updateBook } = useBooks();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const book = getBook(id);

  const [selected, setSelected] = useState<string | null>(null);
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [inspector, setInspector] = useState<"cover" | "details" | "interior">("details");
  const [toast, setToast] = useState<string | null>(null);
  const taRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const activeId = selected ?? book?.pages[2]?.id ?? book?.pages[0]?.id ?? null;
  const page = book?.pages.find((p) => p.id === activeId) ?? book?.pages[0] ?? null;
  const lang = languageByCode(book?.language ?? "en");

  const bodyFontsForLang = useMemo(
    () => [...BODY_FONTS.filter((f) => f.group === "script" && f.script === lang.script), ...BODY_FONTS.filter((f) => f.group === "latin")],
    [lang.script],
  );
  const titleFontsForLang = useMemo(
    () => [...TITLE_FONTS.filter((f) => f.group === "script" && f.script === lang.script), ...TITLE_FONTS.filter((f) => f.group === "latin")],
    [lang.script],
  );

  if (!book) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="display text-2xl text-paper-100">Book not found</h1>
        <p className="mt-2 text-ink-400">This book may have been deleted.</p>
        <Link to="/" className="btn btn-primary mt-6">Back to library</Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="display text-2xl text-paper-100">Admins edit books</h1>
        <p className="mt-2 text-ink-400">You're signed in as a reader. You can read this book, but only the admin can change it.</p>
        <Link to={`/read/${book.id}`} className="btn btn-primary mt-6">Open the reader</Link>
      </div>
    );
  }

  const patch = (fields: Partial<typeof book>) => updateBook(book.id, (b) => ({ ...b, ...fields }));
  const patchCover = (fields: Partial<typeof book.cover>) => updateBook(book.id, (b) => ({ ...b, cover: { ...b.cover, ...fields } }));
  const patchInterior = (fields: Partial<typeof book.interior>) => updateBook(book.id, (b) => ({ ...b, interior: { ...b.interior, ...fields } }));
  const setPage = (pid: string, fields: Partial<Page>) => updateBook(book.id, (b) => updatePage(b, pid, fields));

  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 1500); };

  const defaultTitle = (kind: PageKind) => (kind === "chapter" ? "New chapter" : kind === "part" ? "New part" : "");

  const addPage = (kind: PageKind) => {
    const newPage = makePage(kind, defaultTitle(kind), "");
    updateBook(book.id, (b) => {
      const pages = [...b.pages];
      const idx = pages.findIndex((p) => p.id === activeId);
      if (idx >= 0) pages.splice(idx + 1, 0, newPage);
      else pages.push(newPage);
      return { ...b, pages };
    });
    setSelected(newPage.id);
    setPickerOpen(false);
    setTab("write");
  };

  const onImage = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => patchCover({ template: "photo", customImage: String(reader.result) });
    reader.readAsDataURL(file);
  };

  const insert = (before: string, after = "") => {
    const ta = taRef.current;
    if (!ta || !page) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const val = page.text;
    const next = val.slice(0, s) + before + after + val.slice(e);
    setPage(page.id, { text: next });
    requestAnimationFrame(() => {
      ta.focus();
      const pos = s + before.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const words = page ? countWords(page.text) : 0;
  const groups: Array<"front" | "body" | "back"> = ["front", "body", "back"];

  return (
    <div className="flex min-h-[calc(100vh-57px)] flex-col">
      {/* Toolbar */}
      <div className="no-print sticky top-[57px] z-30 border-b border-ink-700 bg-ink-900/90 px-5 py-2.5 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3">
          <Link to="/" className="btn btn-ghost !px-2"><ArrowLeft size={16} /></Link>
          <div className="min-w-0 flex-1">
            <input
              className="display w-full max-w-md bg-transparent text-lg font-medium text-paper-100 outline-none placeholder:text-ink-600"
              value={book.title}
              onChange={(e) => patch({ title: e.target.value })}
              placeholder="Untitled book"
            />
            <div className="label truncate">{groupLabel(pageMeta(page?.kind ?? "chapter").group)} · {lang.native} · autosaved</div>
          </div>
          <span className="chip hidden sm:inline-flex">{countWords(book.pages.map((p) => p.text).join(" ")).toLocaleString()} words</span>
          <Link to={`/read/${book.id}`} className="btn"><Eye size={15} /> <span className="hidden sm:inline">Read</span></Link>
          <ExportMenu book={book} />
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1600px] flex-1 grid-cols-1 gap-0 lg:grid-cols-[260px_1fr_340px]">
        {/* Pages panel */}
        <aside className="no-print border-b border-ink-700 bg-ink-950/60 lg:border-b-0 lg:border-r">
          <div className="sticky top-[110px] max-h-[calc(100vh-110px)] overflow-y-auto p-3">
            <div className="label mb-2 px-1">Pages</div>
            {groups.map((g) => (
              <div key={g} className="mb-4">
                <div className="mb-1.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-ink-500">{groupLabel(g)}</div>
                <div className="space-y-1">
                  {book.pages.filter((p) => pageMeta(p.kind).group === g).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => { setSelected(p.id); }}
                      className={`group flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-2 text-sm transition-colors ${
                        p.id === activeId ? "border-brass-600 bg-ink-850 text-paper-100" : "border-transparent text-ink-300 hover:bg-ink-850/60"
                      }`}
                    >
                      <span className="flex-1 truncate">{p.title || pageMeta(p.kind).label}</span>
                      <span className="flex gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <MiniBtn title="Move up" onClick={() => updateBook(book.id, (b) => movePage(b, p.id, -1))}><ChevronUp size={13} /></MiniBtn>
                        <MiniBtn title="Move down" onClick={() => updateBook(book.id, (b) => movePage(b, p.id, 1))}><ChevronDown size={13} /></MiniBtn>
                        <MiniBtn title="Duplicate" onClick={() => { updateBook(book.id, (b) => duplicatePage(b, p.id)); flash("Page duplicated"); }}><Copy size={13} /></MiniBtn>
                        <MiniBtn title="Delete" danger onClick={() => { if (book.pages.length > 1 && confirm("Delete this page?")) updateBook(book.id, (b) => removePage(b, p.id)); }}><Trash2 size={13} /></MiniBtn>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button className="btn w-full justify-center" onClick={() => setPickerOpen(true)}><Plus size={15} /> Add page</button>
          </div>
        </aside>

        {/* Center editor */}
        <section className="min-w-0 bg-ink-900">
          {page ? (
            <div className="mx-auto max-w-3xl px-5 py-6">
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="chip">{pageMeta(page.kind).label}</span>
                <span className="text-xs text-ink-500">{pageMeta(page.kind).hint}</span>
              </div>

              <div className="mb-3 flex flex-wrap items-center gap-2">
                {["chapter", "part", "foreword", "preface", "introduction", "epilogue", "appendix", "glossary", "acknowledgements", "about", "colophon"].includes(page.kind) && (
                  <input
                    className="display flex-1 rounded-md border border-ink-600 bg-ink-950 px-3 py-2 text-lg text-paper-100 outline-none focus:border-brass-500"
                    placeholder="Page title"
                    value={page.title}
                    onChange={(e) => setPage(page.id, { title: e.target.value })}
                  />
                )}
              </div>

              <div className="mb-3 flex items-center gap-2">
                <div className="flex rounded-md border border-ink-600 p-0.5">
                  <TabBtn active={tab === "write"} onClick={() => setTab("write")} icon={<Pencil size={13} />}>Write</TabBtn>
                  <TabBtn active={tab === "preview"} onClick={() => setTab("preview")} icon={<Eye size={13} />}>Preview</TabBtn>
                </div>
                <div className="ml-auto flex items-center gap-1.5 rounded-md border border-ink-600 px-2 py-1">
                  <span className="label !text-[9px]">Page type</span>
                  <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" title="Smaller text on this page" onClick={() => setPage(page.id, { fontScale: clamp(+(page.fontScale - 0.05).toFixed(2), 0.65, 2) })}><Minus size={13} /></button>
                  <span className="w-10 text-center font-mono text-xs text-brass-300">{Math.round(page.fontScale * 100)}%</span>
                  <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" title="Larger text on this page" onClick={() => setPage(page.id, { fontScale: clamp(+(page.fontScale + 0.05).toFixed(2), 0.65, 2) })}><Plus size={13} /></button>
                  <button className="grid h-6 w-6 place-items-center rounded text-ink-400 hover:bg-ink-800" title="Reset to book default" onClick={() => setPage(page.id, { fontScale: 1 })}><RotateCcw size={12} /></button>
                </div>
              </div>

              {tab === "write" ? (
                <div>
                  <div className="mb-1.5 flex flex-wrap gap-1">
                    <TinyBtn onClick={() => insert("## ", "\n\n")}>Section heading</TinyBtn>
                    <TinyBtn onClick={() => insert("\n\n*** \n\n")}>Scene break</TinyBtn>
                    <TinyBtn onClick={() => insert("> ", "\n\n")}>Quote</TinyBtn>
                    <TinyBtn onClick={() => insert("**", "**")}>Bold</TinyBtn>
                    <TinyBtn onClick={() => insert("*", "*")}>Italic</TinyBtn>
                    <TinyBtn onClick={() => insert("- ", "\n")}>List</TinyBtn>
                  </div>
                  <textarea
                    ref={taRef}
                    className="min-h-[52vh] w-full resize-y rounded-lg border border-ink-600 bg-ink-950 p-4 font-mono text-[13.5px] leading-relaxed text-ink-100 outline-none focus:border-brass-500"
                    style={{ fontFamily: fontStack(book.interior.bodyFont) }}
                    dir={lang.dir}
                    placeholder={"Write your text here.\n\nA blank line starts a new paragraph.\n## Section heading\n> Quotation\n*** Scene break\n**bold** and *italic*"}
                    value={page.text}
                    onChange={(e) => setPage(page.id, { text: e.target.value })}
                  />
                  <div className="mt-2 flex justify-between text-xs text-ink-500">
                    <span>{words.toLocaleString()} words · ~{Math.max(1, Math.round(words / 230))} min read</span>
                    <span>{page.text.length} characters</span>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center py-4">
                  <PageSheet book={book} page={page} width={620} showFolio={book.pages.indexOf(page) + 1} />
                </div>
              )}
            </div>
          ) : (
            <div className="p-10 text-center text-ink-400">No page selected.</div>
          )}
        </section>

        {/* Inspector */}
        <aside className="no-print border-t border-ink-700 bg-ink-950/60 lg:border-l lg:border-t-0">
          <div className="sticky top-[110px] max-h-[calc(100vh-110px)] overflow-y-auto p-4">
            <div className="mb-4 flex rounded-md border border-ink-600 p-0.5">
              <TabBtn active={inspector === "details"} onClick={() => setInspector("details")} icon={<AlignLeft size={13} />}>Details</TabBtn>
              <TabBtn active={inspector === "cover"} onClick={() => setInspector("cover")} icon={<ImageIcon size={13} />}>Cover</TabBtn>
              <TabBtn active={inspector === "interior"} onClick={() => setInspector("interior")} icon={<Type size={13} />}>Type</TabBtn>
            </div>

            {inspector === "details" && (
              <div className="space-y-4">
                <Field label="Title"><input className="field" value={book.title} onChange={(e) => patch({ title: e.target.value })} /></Field>
                <Field label="Subtitle"><input className="field" value={book.subtitle} onChange={(e) => patch({ subtitle: e.target.value })} placeholder="Optional" /></Field>
                <Field label="Author / pen name"><input className="field" value={book.author} onChange={(e) => patch({ author: e.target.value })} /></Field>
                <Field label="Language">
                  <select
                    className="field"
                    value={book.language}
                    onChange={(e) => {
                      const L = languageByCode(e.target.value);
                      patch({ language: L.code });
                      patchInterior({ bodyFont: L.body });
                      patchCover({ titleFont: L.title });
                      flash(`Set to ${L.name} · ${L.dir === "rtl" ? "right-to-left" : "left-to-right"}`);
                    }}
                  >
                    {LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>{l.native} — {l.name}</option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[11px] text-ink-500">Direction: {lang.dir.toUpperCase()} · script {lang.script}. Choosing a language sets matching typefaces.</p>
                </Field>
                <Field label="Description / blurb">
                  <textarea className="field min-h-[90px]" value={book.description} onChange={(e) => patch({ description: e.target.value })} placeholder="A short summary for the library and exports." />
                </Field>
              </div>
            )}

            {inspector === "cover" && (
              <div className="space-y-5">
                <div className="flex justify-center rounded-lg border border-ink-700 bg-ink-900 p-4">
                  <Cover book={book} width={168} />
                </div>

                <div>
                  <div className="label mb-2">Template</div>
                  <div className="grid grid-cols-3 gap-2">
                    {COVER_TEMPLATES.map((t) => (
                      <button
                        key={t.id}
                        title={t.note}
                        onClick={() => patchCover({ template: t.id })}
                        className={`overflow-hidden rounded-md border transition-colors ${book.cover.template === t.id ? "border-brass-500" : "border-ink-700 hover:border-ink-500"}`}
                      >
                        <Cover book={{ ...book, cover: { ...book.cover, template: t.id } }} width={64} flat />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label mb-2">Palette</div>
                  <div className="flex flex-wrap gap-2">
                    {PALETTES.map((p) => (
                      <button
                        key={p.id}
                        title={p.name}
                        onClick={() => patchCover({ palette: p.id })}
                        className={`h-8 w-8 rounded-full border-2 transition-transform ${book.cover.palette === p.id ? "border-brass-400 scale-110" : "border-ink-600"}`}
                        style={{ background: `linear-gradient(135deg, ${p.bg} 50%, ${p.accent} 50%)` }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label mb-2">Pattern</div>
                  <select className="field" value={book.cover.pattern} onChange={(e) => patchCover({ pattern: e.target.value })}>
                    {PATTERNS.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div>
                  <div className="label mb-2">Title typeface</div>
                  <select className="field" value={book.cover.titleFont} onChange={(e) => patchCover({ titleFont: e.target.value })}>
                    {titleFontsForLang.map((f) => <option key={f.id} value={f.id}>{f.label}{f.script !== "Latin" ? ` · ${f.script}` : ""}</option>)}
                  </select>
                </div>

                {book.cover.template === "photo" && (
                  <div>
                    <div className="label mb-2">Cover image</div>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => onImage(e.target.files?.[0])} />
                    <div className="flex gap-2">
                      <button className="btn flex-1 justify-center" onClick={() => fileRef.current?.click()}><ImageIcon size={14} /> {book.cover.customImage ? "Replace image" : "Upload image"}</button>
                      {book.cover.customImage && <button className="btn" onClick={() => patchCover({ customImage: null })}><X size={14} /></button>}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Toggle label="Show author" on={book.cover.showAuthor} onChange={(v) => patchCover({ showAuthor: v })} />
                  <Toggle label="Show subtitle" on={book.cover.showSubtitle} onChange={(v) => patchCover({ showSubtitle: v })} />
                </div>
              </div>
            )}

            {inspector === "interior" && (
              <div className="space-y-5">
                <div>
                  <div className="label mb-2">Body typeface</div>
                  <select className="field" value={book.interior.bodyFont} onChange={(e) => patchInterior({ bodyFont: e.target.value })}>
                    {bodyFontsForLang.map((f) => <option key={f.id} value={f.id}>{f.label}{f.script !== "Latin" ? ` · ${f.script}` : ""}</option>)}
                  </select>
                  <p className="mt-1.5 text-[11px] text-ink-500">Currently: {fontStack(book.interior.bodyFont).split(",")[0].replace(/"/g, "")}</p>
                </div>

                <Slider label="Book type size" value={book.interior.fontScale} min={0.8} max={1.5} step={0.05} format={(v) => `${Math.round(v * 100)}%`} onChange={(v) => patchInterior({ fontScale: v })} />
                <Slider label="Line height" value={book.interior.lineHeight} min={1.3} max={2.1} step={0.02} format={(v) => v.toFixed(2)} onChange={(v) => patchInterior({ lineHeight: v })} />

                <div>
                  <div className="label mb-2">Margins</div>
                  <div className="flex rounded-md border border-ink-600 p-0.5">
                    {(["narrow", "normal", "wide"] as const).map((m) => (
                      <button key={m} onClick={() => patchInterior({ margin: m })} className={`flex-1 rounded px-2 py-1 text-xs capitalize ${book.interior.margin === m ? "bg-ink-800 text-brass-300" : "text-ink-400"}`}>{m}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label mb-2">Scene break</div>
                  <div className="flex rounded-md border border-ink-600 p-0.5">
                    {(["ornament", "stars", "rule", "space"] as const).map((s) => (
                      <button key={s} onClick={() => patchInterior({ sceneBreak: s })} className={`flex-1 rounded px-2 py-1 text-xs ${book.interior.sceneBreak === s ? "bg-ink-800 text-brass-300" : "text-ink-400"}`}>{s}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="label mb-2">Page number (folio)</div>
                  <div className="flex rounded-md border border-ink-600 p-0.5">
                    {(["bottom", "top", "none"] as const).map((f) => (
                      <button key={f} onClick={() => patchInterior({ folio: f })} className={`flex-1 rounded px-2 py-1 text-xs capitalize ${book.interior.folio === f ? "bg-ink-800 text-brass-300" : "text-ink-400"}`}>{f}</button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Toggle label="Justify text" on={book.interior.justify} onChange={(v) => patchInterior({ justify: v })} />
                  <Toggle label="Drop cap on chapters" on={book.interior.dropCaps} onChange={(v) => patchInterior({ dropCaps: v })} />
                </div>

                <div className="rounded-md border border-ink-700 bg-ink-900 p-3 text-[11px] leading-relaxed text-ink-400">
                  <PanelRight size={13} className="mb-1 text-brass-300" />
                  Page-specific size: every page has its own type size, independent of the book default. Use the <strong className="text-ink-200">Page type</strong> control above the editor to enlarge or shrink the page you're on.
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Add page picker */}
      {pickerOpen && (
        <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-ink-950/80 p-4 backdrop-blur" onClick={() => setPickerOpen(false)}>
          <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-ink-600 bg-ink-900 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="display text-xl text-paper-100">Add a page</h3>
              <button className="btn btn-ghost !px-2" onClick={() => setPickerOpen(false)}><X size={16} /></button>
            </div>
            {(["front", "body", "back"] as const).map((g) => (
              <div key={g} className="mb-5">
                <div className="label mb-2">{groupLabel(g)}</div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {PAGE_CATALOG.filter((p) => p.group === g).map((p) => (
                    <button key={p.kind} onClick={() => addPage(p.kind as PageKind)} className="rounded-lg border border-ink-700 bg-ink-850 px-3 py-2.5 text-left transition-colors hover:border-brass-600">
                      <div className="text-sm text-paper-100">{p.label}</div>
                      <div className="mt-0.5 text-[11px] text-ink-500">{p.hint}</div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {toast && (
        <div className="no-print fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-brass-600 bg-ink-850 px-4 py-2 text-sm text-brass-300 shadow-xl">{toast}</div>
      )}
    </div>
  );
}

/* ---------- small building blocks ---------- */

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="label mb-1.5 block">{label}</label>
      {children}
    </div>
  );
}

function MiniBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      className={`grid h-5 w-5 place-items-center rounded transition-colors ${danger ? "text-ink-400 hover:bg-vermilion/25 hover:text-[#f2b8ad]" : "text-ink-400 hover:bg-ink-750 hover:text-ink-100"}`}
    >
      {children}
    </button>
  );
}

function TabBtn({ active, onClick, children, icon }: { active: boolean; onClick: () => void; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-1.5 rounded px-3 py-1 text-xs transition-colors ${active ? "bg-ink-800 text-brass-300" : "text-ink-400"}`}>
      {icon} {children}
    </button>
  );
}

function TinyBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <button onClick={onClick} className="rounded border border-ink-700 bg-ink-850 px-2 py-1 text-[11px] text-ink-300 transition-colors hover:border-brass-600 hover:text-brass-300">{children}</button>;
}

function Slider({ label, value, min, max, step, onChange, format }: { label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; format: (v: number) => string }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="label">{label}</span>
        <span className="font-mono text-xs text-brass-300">{format(value)}</span>
      </div>
      <input type="range" className="w-full" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="flex w-full items-center justify-between rounded-md border border-ink-700 bg-ink-850 px-3 py-2 text-sm text-ink-200">
      {label}
      <span className={`relative h-5 w-9 rounded-full transition-colors ${on ? "bg-brass-500" : "bg-ink-600"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-ink-950 transition-all ${on ? "left-4.5" : "left-0.5"}`} style={{ left: on ? "18px" : "2px" }} />
      </span>
    </button>
  );
}
