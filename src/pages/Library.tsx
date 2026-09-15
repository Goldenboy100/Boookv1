import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useBooks } from "../lib/books";
import { useAuth } from "../lib/auth";
import { bookWordCount, bookChapterCount } from "../lib/store";
import { LANGUAGES, languageByCode } from "../lib/languages";
import Cover from "../components/Cover";
import { Plus, Search, BookOpen, Trash2, Copy, Pencil, Sparkles } from "lucide-react";

export default function Library() {
  const { books, createBook, deleteBook, duplicateBook } = useBooks();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [lang, setLang] = useState("all");
  const [sort, setSort] = useState<"recent" | "title" | "words">("recent");

  const filtered = useMemo(() => {
    let list = books.filter((b) => {
      const matchesQ =
        !q ||
        b.title.toLowerCase().includes(q.toLowerCase()) ||
        b.author.toLowerCase().includes(q.toLowerCase());
      const matchesLang = lang === "all" || b.language === lang;
      return matchesQ && matchesLang;
    });
    list = [...list].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "words") return bookWordCount(b) - bookWordCount(a);
      return b.updatedAt - a.updatedAt;
    });
    return list;
  }, [books, q, lang, sort]);

  const langsUsed = useMemo(() => {
    const set = new Set(books.map((b) => b.language));
    return LANGUAGES.filter((l) => set.has(l.code));
  }, [books]);

  const newBook = () => {
    if (!isAdmin) return;
    const b = createBook(lang === "all" ? "en" : lang);
    navigate(`/book/${b.id}`);
  };

  const totalWords = books.reduce((n, b) => n + bookWordCount(b), 0);

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-10">
      {/* Hero */}
      <div className="grain relative overflow-hidden rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 p-8 sm:p-10">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brass-700/15 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="label">Your shelf</div>
            <h1 className="display mt-2 text-3xl font-semibold text-paper-100 sm:text-4xl">
              {books.length === 0 ? "Your shelf is empty" : `${books.length} ${books.length === 1 ? "book" : "books"} and counting`}
            </h1>
            <p className="mt-2 max-w-xl text-ink-300">
              {isAdmin
                ? "You're signed in as admin. Create a book, write its pages, dress the cover, and export it when ready."
                : "Browse the books below. Open one to read; page type size is adjustable while reading."}
            </p>
          </div>
          <div className="flex items-center gap-6">
            <Stat label="Words set" value={totalWords.toLocaleString()} />
            <Stat label="Languages" value={String(langsUsed.length)} />
            {isAdmin && (
              <button className="btn btn-primary" onClick={newBook}>
                <Plus size={16} /> New book
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-500" />
          <input className="field pl-9" placeholder="Search by title or author…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="field w-auto" value={lang} onChange={(e) => setLang(e.target.value)}>
          <option value="all">All languages</option>
          {langsUsed.map((l) => (
            <option key={l.code} value={l.code}>{l.native} — {l.name}</option>
          ))}
        </select>
        <select className="field w-auto" value={sort} onChange={(e) => setSort(e.target.value as never)}>
          <option value="recent">Recently edited</option>
          <option value="title">Title A–Z</option>
          <option value="words">Most words</option>
        </select>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-700 py-24 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-ink-600 bg-ink-850 text-brass-300">
            <BookOpen size={24} />
          </div>
          <h3 className="display mt-5 text-xl text-paper-100">{books.length === 0 ? "No books yet" : "Nothing matches"}</h3>
          <p className="mt-2 max-w-sm text-sm text-ink-400">
            {books.length === 0
              ? isAdmin
                ? "Start your first book — you can pick a language and a cover, then write."
                : "The admin hasn't added any books yet."
              : "Try a different search or language filter."}
          </p>
          {isAdmin && books.length === 0 && (
            <button className="btn btn-primary mt-6" onClick={newBook}><Plus size={16} /> Create your first book</button>
          )}
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {filtered.map((b) => {
            const L = languageByCode(b.language);
            return (
              <div key={b.id} className="group relative">
                <Link to={`/read/${b.id}`} className="block">
                  <div className="transition-transform duration-200 group-hover:-translate-y-1">
                    <Cover book={b} width={200} className="rounded-md" />
                  </div>
                </Link>
                <div className="mt-3">
                  <Link to={`/read/${b.id}`} className="display block truncate text-[15px] font-medium text-paper-100 hover:text-brass-300">{b.title}</Link>
                  <div className="mt-0.5 truncate text-xs text-ink-400">{b.author}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="chip">{L.code.toUpperCase()}</span>
                    <span className="chip">{bookChapterCount(b)} ch</span>
                    <span className="chip">{bookWordCount(b).toLocaleString()} w</span>
                  </div>
                </div>
                {isAdmin && (
                  <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
                    <IconBtn title="Edit" onClick={() => navigate(`/book/${b.id}`)}><Pencil size={14} /></IconBtn>
                    <IconBtn title="Duplicate" onClick={() => duplicateBook(b.id)}><Copy size={14} /></IconBtn>
                    <IconBtn title="Delete" danger onClick={() => { if (confirm(`Delete “${b.title}”? This cannot be undone.`)) deleteBook(b.id); }}><Trash2 size={14} /></IconBtn>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {isAdmin && filtered.length > 0 && (
        <div className="mt-12 flex justify-center">
          <button className="btn" onClick={newBook}><Sparkles size={15} /> Create another book</button>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-right">
      <div className="display text-2xl font-semibold text-brass-300">{value}</div>
      <div className="label mt-0.5">{label}</div>
    </div>
  );
}

function IconBtn({ children, onClick, title, danger }: { children: React.ReactNode; onClick: () => void; title: string; danger?: boolean }) {
  return (
    <button
      title={title}
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`grid h-7 w-7 place-items-center rounded-md border backdrop-blur transition-colors ${
        danger ? "border-vermilion/40 bg-ink-900/80 text-[#f2b8ad] hover:bg-vermilion/25" : "border-ink-600 bg-ink-900/80 text-ink-200 hover:bg-ink-750"
      }`}
    >
      {children}
    </button>
  );
}
