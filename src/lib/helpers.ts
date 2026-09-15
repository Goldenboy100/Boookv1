import type { Book, Page } from "./types";
import { pageMeta } from "./pages";
import { makePage } from "./store";
import type { PageKind } from "./types";

/** Insert a page into the correct region (front / body / back). */
export function updatePageOrder(book: Book, page: Page): Book {
  const group = pageMeta(page.kind).group;
  const pages = [...book.pages];
  if (group === "front") {
    let last = -1;
    pages.forEach((p, i) => {
      if (pageMeta(p.kind).group === "front") last = i;
    });
    pages.splice(last + 1, 0, page);
  } else if (group === "body") {
    let last = -1;
    pages.forEach((p, i) => {
      if (pageMeta(p.kind).group === "body") last = i;
    });
    pages.splice(last + 1, 0, page);
  } else {
    pages.push(page);
  }
  return { ...book, pages };
}

/** Insert a page directly after the given page id (or at the end). */
export function insertAfter(book: Book, afterId: string | null, kind: PageKind, title = "", text = ""): Book {
  const page = makePage(kind, title, text);
  const pages = [...book.pages];
  const idx = afterId ? pages.findIndex((p) => p.id === afterId) : -1;
  if (idx >= 0) pages.splice(idx + 1, 0, page);
  else pages.push(page);
  return { ...book, pages };
}

export function removePage(book: Book, id: string): Book {
  return { ...book, pages: book.pages.filter((p) => p.id !== id) };
}

export function movePage(book: Book, id: string, dir: -1 | 1): Book {
  const pages = [...book.pages];
  const i = pages.findIndex((p) => p.id === id);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= pages.length) return book;
  [pages[i], pages[j]] = [pages[j], pages[i]];
  return { ...book, pages };
}

export function duplicatePage(book: Book, id: string): Book {
  const pages = [...book.pages];
  const i = pages.findIndex((p) => p.id === id);
  if (i < 0) return book;
  const copy: Page = { ...pages[i], id: `pg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}` };
  pages.splice(i + 1, 0, copy);
  return { ...book, pages };
}

export function updatePage(book: Book, id: string, patch: Partial<Page>): Book {
  return { ...book, pages: book.pages.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
}
