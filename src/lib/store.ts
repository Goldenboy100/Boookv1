import type { Book, Page, PageKind } from "./types";

const BOOKS_KEY = "quire.books.v1";
const CLOUD_KEY = "quire.cloud.v1";

export function uid(prefix = "id"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function loadBooks(): Book[] {
  try {
    const raw = localStorage.getItem(BOOKS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Book[]) : [];
  } catch {
    return [];
  }
}

export function saveBooks(books: Book[]): void {
  try {
    localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
  } catch {
    /* storage full or unavailable */
  }
}

export function makePage(kind: PageKind, title = "", text = ""): Page {
  return { id: uid("pg"), kind, title, text, fontScale: 1 };
}

export function blankBook(language = "en"): Book {
  const now = Date.now();
  return {
    id: uid("bk"),
    title: "Untitled book",
    subtitle: "",
    author: "Unknown author",
    language,
    description: "",
    storage: "browser",
    cover: {
      template: "classic",
      palette: "ink-paper",
      pattern: "none",
      titleFont: "fraunces",
      showAuthor: true,
      showSubtitle: true,
      customImage: null,
    },
    interior: {
      bodyFont: "literata",
      fontScale: 1,
      lineHeight: 1.62,
      margin: "normal",
      justify: true,
      dropCaps: false,
      sceneBreak: "ornament",
      folio: "bottom",
    },
    pages: [
      makePage("title", "", ""),
      makePage("copyright", "", ""),
      makePage("chapter", "Chapter one", "Begin your story here.\n\nEach block of text separated by a blank line becomes a new paragraph."),
    ],
    createdAt: now,
    updatedAt: now,
  };
}

export function bookWordCount(book: Book): number {
  return book.pages.reduce((n, p) => {
    const t = p.text.trim();
    return n + (t ? t.split(/\s+/).length : 0);
  }, 0);
}

export function bookChapterCount(book: Book): number {
  return book.pages.filter((p) => p.kind === "chapter" || p.kind === "part").length;
}

export function touch(book: Book): Book {
  return { ...book, updatedAt: Date.now() };
}
