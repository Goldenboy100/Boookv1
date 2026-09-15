import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../lib/books";
import { useAuth } from "../lib/auth";
import Cover from "../components/Cover";
import PageSheet from "../components/PageSheet";
import ExportMenu from "../components/ExportMenu";
import { pageMeta } from "../lib/pages";
import { ArrowLeft, ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, List, Pencil, BookOpen } from "lucide-react";

export default function Reader() {
  const { id = "" } = useParams();
  const { getBook, updateBook } = useBooks();
  const { isAdmin } = useAuth();
  const book = getBook(id);

  // pos === -1 shows the cover; otherwise pos indexes into book.pages
  const [pos, setPos] = useState(-1);
  const [zoom, setZoom] = useState(1);
  const [spread, setSpread] = useState(false);
  const [toc, setToc] = useState(false);

  const pageCount = book ? book.pages.length : 0;
  const maxPos = Math.max(0, pageCount - 1);
  const step = spread ? 2 : 1;
  const goNext = () => setPos((p) => Math.min(maxPos, p + step));
  const goPrev = () => setPos((p) => Math.max(-1, p - step));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") setPos((p) => Math.min(maxPos, p + step));
      if (e.key === "ArrowLeft") setPos((p) => Math.max(-1, p - step));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [maxPos, step]);

  const tocItems = useMemo(() => book?.pages ?? [], [book]);

  if (!book) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="display text-2xl text-paper-100">Book not found</h1>
        <Link to="/" className="btn btn-primary mt-6">Back to library</Link>
      </div>
    );
  }

  const bumpZoom = (d: number) => setZoom((z) => Math.min(1.9, Math.max(0.7, +(z + d).toFixed(2))));
  const scaledPage = (p: (typeof book.pages)[number]) => ({ ...p, fontScale: p.fontScale * zoom });
  const jump = (i: number) => { setPos(i); setToc(false); };

  const setPageScale = (i: number, fn: (s: number) => number) =>
    updateBook(book.id, (b) => ({ ...b, pages: b.pages.map((p, idx) => (idx === i ? { ...p, fontScale: Math.min(2, Math.max(0.65, +fn(p.fontScale).toFixed(2))) } : p)) }));

  const firstIdx = pos;
  const secondIdx = spread && pos + 1 <= maxPos ? pos + 1 : null;

  return (
    <div className="min-h-[calc(100vh-57px)] bg-ink-950">
      {/* Reading toolbar */}
      <div className="no-print sticky top-[57px] z-30 border-b border-ink-700 bg-ink-900/90 px-5 py-2.5 backdrop-blur">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3">
          <Link to="/" className="btn btn-ghost !px-2"><ArrowLeft size={16} /></Link>
          <div className="min-w-0 flex-1">
            <div className="display truncate text-base font-medium text-paper-100">{book.title}</div>
            <div className="label truncate">
              {pos === -1
                ? "Cover"
                : `${pageMeta(book.pages[pos].kind).label}${book.pages[pos].title ? ` · ${book.pages[pos].title}` : ""}`}
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-md border border-ink-600 px-2 py-1" title="Reading text size">
            <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" onClick={() => bumpZoom(-0.1)}><Minus size={13} /></button>
            <span className="w-10 text-center font-mono text-xs text-brass-300">{Math.round(zoom * 100)}%</span>
            <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" onClick={() => bumpZoom(0.1)}><Plus size={13} /></button>
            <button className="grid h-6 w-6 place-items-center rounded text-ink-400 hover:bg-ink-800" title="Reset size" onClick={() => setZoom(1)}><RotateCcw size={12} /></button>
          </div>

          <button className={`btn ${spread ? "!border-brass-600 !text-brass-300" : ""}`} onClick={() => { setSpread((s) => !s); }} title="Two-page spread">
            <BookOpen size={15} /> <span className="hidden sm:inline">Spread</span>
          </button>
          <button className="btn" onClick={() => setToc((t) => !t)}><List size={15} /> <span className="hidden sm:inline">Contents</span></button>
          {isAdmin && <Link to={`/book/${book.id}`} className="btn"><Pencil size={15} /> <span className="hidden sm:inline">Edit</span></Link>}
          <ExportMenu book={book} />
        </div>
      </div>

      {/* Contents drawer */}
      {toc && (
        <div className="no-print fixed inset-0 z-40 flex bg-ink-950/60" onClick={() => setToc(false)}>
          <div className="h-full w-80 overflow-y-auto border-r border-ink-700 bg-ink-900 p-5" onClick={(e) => e.stopPropagation()}>
            <div className="label mb-3">Contents</div>
            <button onClick={() => jump(-1)} className={`mb-1 block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-ink-850 ${pos === -1 ? "text-brass-300" : "text-ink-300"}`}>Cover</button>
            <div className="rule my-2" />
            {tocItems.map((p, i) => (
              <button key={p.id} onClick={() => jump(i)} className={`block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-ink-850 ${pos === i ? "text-brass-300" : "text-ink-300"}`}>
                <span className="mr-2 font-mono text-[10px] text-ink-500">{String(i + 1).padStart(2, "0")}</span>
                {p.title || pageMeta(p.kind).label}
              </button>
            ))}
          </div>
          <div className="flex-1" />
        </div>
      )}

      {/* Page area */}
      <div className="mx-auto flex max-w-[1200px] flex-col items-center px-4 py-8">
        {pos === -1 ? (
          <div className="flex flex-col items-center">
            <Cover book={book} width={300} />
            <button className="btn btn-primary mt-8" onClick={() => setPos(0)}>Open the book <ChevronRight size={15} /></button>
          </div>
        ) : spread ? (
          <div className="flex w-full flex-wrap justify-center gap-4">
            <PageSheet book={book} page={scaledPage(book.pages[firstIdx])} width={430} showFolio={firstIdx + 1} />
            {secondIdx != null && <PageSheet book={book} page={scaledPage(book.pages[secondIdx])} width={430} showFolio={secondIdx + 1} />}
          </div>
        ) : (
          <PageSheet book={book} page={scaledPage(book.pages[pos])} width={640} showFolio={pos + 1} />
        )}

        {/* Nav */}
        <div className="no-print mt-8 flex items-center gap-4">
          <button className="btn" onClick={goPrev} disabled={pos <= -1}><ChevronLeft size={15} /> Previous</button>
          <span className="font-mono text-xs text-ink-400">{pos === -1 ? "Cover" : `${pos + 1} / ${pageCount}`}</span>
          <button className="btn" onClick={goNext} disabled={pos >= maxPos}>Next <ChevronRight size={15} /></button>
        </div>

        {/* Per-page size controls */}
        {pos >= 0 && (
          <div className="no-print mt-4 flex items-center gap-2 rounded-lg border border-ink-700 bg-ink-900 px-4 py-2 text-xs text-ink-400">
            <span className="label !text-[9px]">This page's size</span>
            <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" onClick={() => setPageScale(pos, (s) => s - 0.05)}><Minus size={12} /></button>
            <span className="w-9 text-center font-mono text-brass-300">{Math.round(book.pages[pos].fontScale * 100)}%</span>
            <button className="grid h-6 w-6 place-items-center rounded hover:bg-ink-800" onClick={() => setPageScale(pos, (s) => s + 0.05)}><Plus size={12} /></button>
            <button className="grid h-6 w-6 place-items-center rounded text-ink-500 hover:bg-ink-800" title="Reset this page" onClick={() => setPageScale(pos, () => 1)}><RotateCcw size={11} /></button>
            <span className="ml-2 hidden sm:inline">Adjusts this page only and saves it.</span>
          </div>
        )}
      </div>
    </div>
  );
}
