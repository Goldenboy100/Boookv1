import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../lib/books";
import { useAuth } from "../lib/auth";
import { bookWordCount, bookChapterCount } from "../lib/store";
import { exportLibraryJson, exportBookJson, parseLibrary } from "../lib/export";
import { languageByCode } from "../lib/languages";
import Cover from "../components/Cover";
import { Plus, Trash2, Copy, Pencil, Eye, Upload, Download, ShieldCheck, Database, HardDrive, AlertTriangle, Check, BookOpen } from "lucide-react";

export default function Dashboard() {
  const { books, createBook, deleteBook, duplicateBook, updateBook, replaceAll } = useBooks();
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [flash, setFlash] = useState<string | null>(null);

  const stats = useMemo(() => {
    const words = books.reduce((n, b) => n + bookWordCount(b), 0);
    const chapters = books.reduce((n, b) => n + bookChapterCount(b), 0);
    const langs = new Set(books.map((b) => b.language)).size;
    const pages = books.reduce((n, b) => n + b.pages.length, 0);
    const published = books.filter((b) => b.storage === "database").length;
    return { words, chapters, langs, pages, published, local: books.length - published };
  }, [books]);

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="display text-2xl text-paper-100">Admin only</h1>
        <p className="mt-2 text-ink-400">The dashboard is available to the studio admin.</p>
        <Link to="/login" className="btn btn-primary mt-6">Sign in as admin</Link>
      </div>
    );
  }

  const newBook = () => { const b = createBook("en"); navigate(`/book/${b.id}`); };
  const toast = (m: string) => { setFlash(m); setTimeout(() => setFlash(null), 2000); };

  const onImport = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseLibrary(String(reader.result));
      if (!parsed) { toast("Could not read that file"); return; }
      replaceAll(parsed);
      toast(`Imported ${parsed.length} book${parsed.length === 1 ? "" : "s"}`);
    };
    reader.readAsText(file);
  };

  const clearStorage = () => {
    if (confirm("Delete every book stored in this browser? This cannot be undone.")) {
      replaceAll([]);
      toast("Browser storage cleared");
    }
  };

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="label">Admin dashboard</div>
          <h1 className="display mt-2 text-3xl font-semibold text-paper-100">Studio overview</h1>
          <p className="mt-1 text-ink-400">Signed in as <span className="text-brass-300">{user?.username}</span> · full control over books, covers and exports.</p>
        </div>
        <div className="flex gap-2">
          <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => onImport(e.target.files?.[0])} />
          <button className="btn" onClick={() => fileRef.current?.click()}><Upload size={15} /> Import</button>
          <button className="btn" onClick={() => { exportLibraryJson(books); toast("Library backup downloaded"); }} disabled={books.length === 0}><Download size={15} /> Backup all</button>
          <button className="btn btn-primary" onClick={newBook}><Plus size={16} /> New book</button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Books" value={books.length} icon={<Pencil size={16} />} />
        <StatCard label="Words" value={stats.words.toLocaleString()} icon={<BookOpen size={16} />} />
        <StatCard label="Pages" value={stats.pages} icon={<BookOpen size={16} />} />
        <StatCard label="Chapters" value={stats.chapters} icon={<BookOpen size={16} />} />
        <StatCard label="Languages" value={stats.langs} icon={<BookOpen size={16} />} />
        <StatCard label="In database" value={stats.published} icon={<Database size={16} />} />
      </div>

      {/* Table */}
      <div className="mt-8 overflow-hidden rounded-xl border border-ink-700">
        <div className="flex items-center gap-4 border-b border-ink-700 bg-ink-850 px-4 py-3 text-[11px] uppercase tracking-wider text-ink-400">
          <span className="w-12">Cover</span>
          <span className="flex-1">Title</span>
          <span className="w-28 hidden sm:block">Language</span>
          <span className="w-20 text-right">Words</span>
          <span className="w-24 text-right">Storage</span>
          <span className="w-40 text-right">Actions</span>
        </div>
        {books.length === 0 ? (
          <div className="px-4 py-16 text-center text-ink-400">No books yet. Create your first one.</div>
        ) : (
          books.map((b) => {
            const L = languageByCode(b.language);
            return (
              <div key={b.id} className="flex items-center gap-4 border-b border-ink-800 px-4 py-3 last:border-0 hover:bg-ink-850/40">
                <Link to={`/read/${b.id}`} className="w-12"><Cover book={b} width={44} flat /></Link>
                <div className="min-w-0 flex-1">
                  <Link to={`/read/${b.id}`} className="display block truncate text-paper-100 hover:text-brass-300">{b.title}</Link>
                  <div className="truncate text-xs text-ink-500">{b.author} · {bookChapterCount(b)} chapters · edited {new Date(b.updatedAt).toLocaleDateString()}</div>
                </div>
                <span className="chip hidden sm:inline-flex w-28 justify-center">{L.code.toUpperCase()}</span>
                <span className="w-20 text-right font-mono text-sm text-ink-300">{bookWordCount(b).toLocaleString()}</span>
                <span className="w-24 text-right">
                  <button
                    className={`chip ${b.storage === "database" ? "!border-teal/50 !text-teal" : ""}`}
                    title="Toggle storage"
                    onClick={() => updateBook(b.id, (x) => ({ ...x, storage: x.storage === "database" ? "browser" : "database" }))}
                  >
                    {b.storage === "database" ? <><Database size={11} /> DB</> : <><HardDrive size={11} /> Local</>}
                  </button>
                </span>
                <div className="w-40 flex justify-end gap-1">
                  <RowBtn title="Read" onClick={() => navigate(`/read/${b.id}`)}><Eye size={14} /></RowBtn>
                  <RowBtn title="Edit" onClick={() => navigate(`/book/${b.id}`)}><Pencil size={14} /></RowBtn>
                  <RowBtn title="Duplicate" onClick={() => { duplicateBook(b.id); toast("Book duplicated"); }}><Copy size={14} /></RowBtn>
                  <RowBtn title="Export JSON" onClick={() => exportBookJson(b)}><Download size={14} /></RowBtn>
                  <RowBtn title="Delete" danger onClick={() => { if (confirm(`Delete \u201C${b.title}\u201D?`)) { deleteBook(b.id); toast("Book deleted"); } }}><Trash2 size={14} /></RowBtn>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Danger zone */}
      <div className="mt-10 rounded-xl border border-vermilion/30 bg-vermilion/5 p-6">
        <div className="flex items-center gap-2 text-[#f2b8ad]"><AlertTriangle size={16} /> <h3 className="display text-lg">Danger zone</h3></div>
        <p className="mt-2 max-w-2xl text-sm text-ink-400">Books live in this browser's storage. Back them up before clearing. Clearing removes every book from this device.</p>
        <button className="btn btn-danger mt-4" onClick={clearStorage}><Trash2 size={15} /> Clear browser storage</button>
      </div>

      {/* Account */}
      <div className="mt-6 flex items-center gap-3 rounded-xl border border-ink-700 bg-ink-850 p-5 text-sm text-ink-300">
        <ShieldCheck size={18} className="text-brass-300" />
        <span>Admin account <strong className="text-paper-100">faraj</strong> can create, edit, publish and delete books. Readers get a read-only shelf.</span>
      </div>

      {flash && <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full border border-brass-600 bg-ink-850 px-4 py-2 text-sm text-brass-300 shadow-xl"><Check size={14} className="mr-1 inline" />{flash}</div>}
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string | number; icon: React.ReactNode }) {
  return (
    <div className="card p-4">
      <div className="flex items-center gap-2 text-ink-500">{icon}<span className="label">{label}</span></div>
      <div className="display mt-2 text-2xl font-semibold text-brass-300">{value}</div>
    </div>
  );
}

function RowBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button title={title} onClick={onClick} className={`grid h-7 w-7 place-items-center rounded-md border transition-colors ${danger ? "border-vermilion/30 text-[#f2b8ad] hover:bg-vermilion/20" : "border-ink-700 text-ink-300 hover:bg-ink-800"}`}>{children}</button>
  );
}
