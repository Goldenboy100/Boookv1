import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Book } from "./types";
import { blankBook, loadBooks, saveBooks, touch, uid } from "./store";

interface BooksValue {
  books: Book[];
  getBook: (id: string) => Book | undefined;
  createBook: (language?: string) => Book;
  updateBook: (id: string, updater: (b: Book) => Book) => void;
  deleteBook: (id: string) => void;
  duplicateBook: (id: string) => Book | undefined;
  replaceAll: (books: Book[]) => void;
}

const BooksContext = createContext<BooksValue | null>(null);

export function BooksProvider({ children }: { children: ReactNode }) {
  const [books, setBooks] = useState<Book[]>(() => loadBooks());

  useEffect(() => {
    saveBooks(books);
  }, [books]);

  const getBook = useCallback((id: string) => books.find((b) => b.id === id), [books]);

  const createBook = useCallback((language = "en") => {
    const b = blankBook(language);
    setBooks((prev) => [b, ...prev]);
    return b;
  }, []);

  const updateBook = useCallback((id: string, updater: (b: Book) => Book) => {
    setBooks((prev) => prev.map((b) => (b.id === id ? touch(updater(b)) : b)));
  }, []);

  const deleteBook = useCallback((id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const duplicateBook = useCallback((id: string) => {
    let copy: Book | undefined;
    setBooks((prev) => {
      const src = prev.find((b) => b.id === id);
      if (!src) return prev;
      copy = {
        ...structuredClone(src),
        id: uid("bk"),
        title: `${src.title} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      return [copy, ...prev];
    });
    return copy;
  }, []);

  const replaceAll = useCallback((next: Book[]) => setBooks(next), []);

  const value = useMemo<BooksValue>(
    () => ({ books, getBook, createBook, updateBook, deleteBook, duplicateBook, replaceAll }),
    [books, getBook, createBook, updateBook, deleteBook, duplicateBook, replaceAll],
  );

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
}

export function useBooks(): BooksValue {
  const ctx = useContext(BooksContext);
  if (!ctx) throw new Error("useBooks must be used inside BooksProvider");
  return ctx;
}
