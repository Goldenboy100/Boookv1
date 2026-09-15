import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBooks } from "../lib/books";
import { useAuth } from "../lib/auth";
import { PAGE_CATALOG } from "../lib/pages";
import { makePage } from "../lib/store";
import { updatePageOrder } from "../lib/helpers";
import type { PageKind } from "../lib/types";
import { BookPlus, Check, ChevronRight } from "lucide-react";

interface PartDetail {
  what: string;
  why: string;
  example: string;
}

const DETAILS: Record<string, PartDetail> = {
  "half-title": { what: "A page carrying only the book's title.", why: "Traditionally the very first page, a quiet breath before the title page proper. Often omitted in shorter books.", example: "The Salt Road" },
  title: { what: "The book's official face: title, subtitle, author, sometimes the imprint.", why: "The legal and bibliographic identity of the work. Every book has exactly one.", example: "THE SALT ROAD · A journey across the inland sea · by Faraj" },
  copyright: { what: "Edition, year, rights statement, publisher and legal lines.", why: "Establishes ownership and the terms of use. Small type, low on the page.", example: "First edition, 2026. All rights reserved." },
  dedication: { what: "A short, personal line addressed to one person.", why: "Optional and intimate — a single sentence, set alone on its own page.", example: "For N., who kept the lamp lit." },
  epigraph: { what: "A quotation that sets the tone for the whole book.", why: "Optional. A few lines from another writer, aligned away from the text block.", example: "\u201C The road doesn't end; it only narrows. \u201D" },
  contents: { what: "An ordered list of the book's parts and chapters.", why: "Lets a reader navigate. In Quire it builds itself from your chapters.", example: "Contents · Part one · Chapter one · Chapter two" },
  foreword: { what: "An introduction written by someone other than the author.", why: "Borrowed authority — a peer or notable voice endorsing and framing the book.", example: "When I first read these pages, I\u2026" },
  preface: { what: "How and why the book came to be, in the author's own voice.", why: "Addresses the making of the book rather than its subject.", example: "This book began as a letter I never sent." },
  introduction: { what: "Orients the reader to the subject itself.", why: "Unlike the preface, it deals with the content — what the book argues or tells.", example: "To understand the salt roads, begin with the desert." },
  part: { what: "A divider that gathers chapters into a named section.", why: "Gives shape to long works — a way to pace a book into movements.", example: "PART ONE — Departures" },
  chapter: { what: "The main unit of the book, where the telling happens.", why: "Chapters break the work into readable strides, each with its own opening.", example: "Chapter one — The weighbridge at dawn" },
  interlude: { what: "A short passage set between chapters.", why: "A palette cleanser: a poem, a document, a breath before the next chapter.", example: "A map. A song. A single paragraph." },
  epilogue: { what: "A short section catching up with the characters after the end.", why: "Closes the loop the story opened, without starting anything new.", example: "Ten years later, the salt had gone." },
  appendix: { what: "Supplementary material: tables, sources, recipes, documents.", why: "Keeps the main text clean while preserving the extra detail.", example: "Appendix A — A chronology of the routes" },
  glossary: { what: "Definitions of specialised terms used in the book.", why: "Helps a general reader without cluttering the chapters.", example: "Karawan — a merchant caravan\u2026" },
  acknowledgements: { what: "Thanks to the people and institutions who helped.", why: "A courtesy and a record of the book's real dependencies.", example: "The staff of the archive, and M. for the long conversations." },
  about: { what: "A short biography of the author.", why: "Standard on the final pages — who is writing, in a paragraph or two.", example: "Faraj writes about travel, memory and language." },
  colophon: { what: "How the book was made: typefaces, date, place, tools.", why: "A printer's signature at the very end — a note on the craft of this edition.", example: "Set in Literata. Built with Quire, 2026." },
  blank: { what: "An empty page used to control pagination.", why: "Chapter openings traditionally begin on a recto (right-hand) page.", example: "" },
};

const GROUPS = [
  { key: "front" as const, title: "Front matter", blurb: "Everything before the first chapter. It prepares the reader and establishes the book's identity." },
  { key: "body" as const, title: "The book", blurb: "The heart of the work — parts, chapters and the reading itself." },
  { key: "back" as const, title: "Back matter", blurb: "Reference, gratitude and the maker's note, after the story is done." },
];

export default function Anatomy() {
  const { books, getBook, updateBook } = useBooks();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [added, setAdded] = useState<string | null>(null);
  const [picker, setPicker] = useState<string | null>(null);

  const addToBook = (kind: string, bookId: string) => {
    const book = getBook(bookId);
    if (!book) return;
    const d = DETAILS[kind];
    const page = makePage(kind as PageKind, kind === "chapter" ? "New chapter" : kind === "part" ? "New part" : "", d?.example ?? "");
    updateBook(bookId, (b) => updatePageOrder(b, page));
    setAdded(kind);
    setPicker(null);
    setTimeout(() => setAdded(null), 1600);
  };

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12">
      <div className="label">Reference</div>
      <h1 className="display mt-2 text-4xl font-semibold text-paper-100 sm:text-5xl">The anatomy of a book</h1>
      <p className="mt-4 max-w-2xl text-ink-300">
        Before you write, it helps to know the shape of the thing you're making. A finished book is a
        sequence of standard parts, in a standard order. Here is what each one is for — and you can drop
        any of them straight into a book you're working on.
      </p>

      <div className="mt-10 overflow-x-auto rounded-xl border border-ink-700 bg-ink-850 p-5">
        <div className="label mb-4">The standard order</div>
        <div className="flex items-stretch gap-2 min-w-max">
          {[
            { t: "Cover", s: "spine & flaps" },
            { t: "Half title", s: "front" },
            { t: "Title page", s: "front" },
            { t: "Copyright", s: "front" },
            { t: "Dedication", s: "front" },
            { t: "Contents", s: "front" },
            { t: "Introduction", s: "front" },
            { t: "Chapters", s: "the book" },
            { t: "Epilogue", s: "the book" },
            { t: "Appendices", s: "back" },
            { t: "About / Colophon", s: "back" },
          ].map((s, i, arr) => (
            <div key={s.t} className="flex items-center gap-2">
              <div className="rounded-lg border border-ink-600 bg-ink-900 px-3 py-2 text-center">
                <div className="whitespace-nowrap text-[13px] font-medium text-paper-100">{s.t}</div>
                <div className="label mt-0.5 text-[8px]">{s.s}</div>
              </div>
              {i < arr.length - 1 && <ChevronRight size={14} className="text-ink-600" />}
            </div>
          ))}
        </div>
      </div>

      {GROUPS.map((g) => (
        <section key={g.key} className="mt-14">
          <div className="flex items-baseline gap-4">
            <h2 className="display text-2xl font-semibold text-brass-300">{g.title}</h2>
            <div className="rule-double flex-1" />
          </div>
          <p className="mt-3 max-w-2xl text-sm text-ink-400">{g.blurb}</p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {PAGE_CATALOG.filter((p) => p.group === g.key).map((p) => {
              const d = DETAILS[p.kind];
              return (
                <div key={p.kind} className="card relative p-5">
                  <h3 className="display text-lg font-medium text-paper-100">{p.label}</h3>
                  <p className="mt-1 text-sm text-ink-300">{d?.what}</p>
                  <p className="mt-3 text-sm leading-relaxed text-ink-400">{d?.why}</p>
                  {d?.example && (
                    <div className="mt-3 rounded-md border border-ink-700 bg-ink-950 px-3 py-2 text-[13px] italic text-paper-300">
                      {d.example}
                    </div>
                  )}

                  {isAdmin && (
                    <div className="mt-4">
                      {picker === p.kind ? (
                        <div className="flex flex-wrap gap-1.5">
                          {books.length === 0 && <span className="text-xs text-ink-500">Create a book first.</span>}
                          {books.map((b) => (
                            <button key={b.id} className="chip hover:border-brass-500 hover:text-brass-300" onClick={() => addToBook(p.kind, b.id)}>
                              {b.title}
                            </button>
                          ))}
                          <button className="chip" onClick={() => setPicker(null)}>Cancel</button>
                        </div>
                      ) : (
                        <button className="btn btn-ghost !px-2 !py-1 !text-xs" onClick={() => setPicker(p.kind)}>
                          {added === p.kind ? <><Check size={13} className="text-sage" /> Added</> : <><BookPlus size={13} /> Add to a book</>}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="mt-16 rounded-2xl border border-ink-700 bg-gradient-to-br from-ink-850 to-ink-950 p-8">
        <h2 className="display text-2xl font-semibold text-paper-100">How to put yours together</h2>
        <ol className="mt-5 space-y-4 text-ink-300">
          {[
            "Pick a language. Quire points the interior at the right typeface and flips the page direction for right-to-left scripts.",
            "Draft the front matter: a title page, a copyright line, and a contents page that builds itself.",
            "Write your chapters. Each block separated by a blank line becomes a paragraph; *** becomes a scene break; ## starts a section heading.",
            "Dress the cover — choose a template, a palette, a pattern and a title face, or drop in your own photograph.",
            "Tune the interior: typeface, base size, line height, margins, justified or ragged, drop caps, where the page number sits.",
            "Set page-specific type. Any single page can be made larger or smaller than the rest without touching the others.",
            "Export. Print to PDF, build an EPUB for e-readers, or download a clean Markdown manuscript.",
          ].map((step, i) => (
            <li key={i} className="flex gap-4">
              <span className="display mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-full border border-brass-600 bg-ink-900 text-sm font-semibold text-brass-300">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <div className="mt-7 flex flex-wrap gap-3">
          <button className="btn btn-primary" onClick={() => navigate(isAdmin ? "/" : "/login")}>
            {isAdmin ? "Go to your library" : "Sign in to start"}
          </button>
          {!isAdmin && <button className="btn" onClick={() => navigate("/")}>Browse the shelf</button>}
        </div>
      </section>
    </div>
  );
}
