import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useBooks } from "../lib/books";
import Cover from "../components/Cover";
import PageSheet from "../components/PageSheet";
import { ArrowLeft, Printer } from "lucide-react";

export default function PrintView() {
  const { id = "" } = useParams();
  const { getBook } = useBooks();
  const book = getBook(id);

  useEffect(() => {
    if (!book) return;
    const t = setTimeout(() => window.print(), 500);
    return () => clearTimeout(t);
  }, [book]);

  if (!book) {
    return (
      <div className="mx-auto max-w-md py-24 text-center">
        <h1 className="display text-2xl text-paper-100">Book not found</h1>
        <Link to="/" className="btn btn-primary mt-6">Back to library</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <div className="no-print sticky top-0 z-30 border-b border-ink-700 bg-ink-900/90 px-5 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-[820px] items-center gap-3">
          <Link to={`/read/${book.id}`} className="btn btn-ghost !px-2"><ArrowLeft size={16} /></Link>
          <div className="flex-1">
            <div className="display text-sm text-paper-100">Print layout — {book.title}</div>
            <div className="label">Choose “Save as PDF” as the destination</div>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}><Printer size={15} /> Print / Save PDF</button>
        </div>
      </div>

      <div className="mx-auto max-w-[820px] px-4 py-8">
        <div className="print-page mb-10 flex items-center justify-center bg-white p-10 text-paper-ink shadow-xl" style={{ minHeight: "80vh" }}>
          <Cover book={book} width={360} flat />
        </div>
        {book.pages.map((p, i) => (
          <div key={p.id} className="print-page mb-10 bg-white p-12 shadow-xl" style={{ minHeight: "70vh" }}>
            <PageSheet book={book} page={p} plain showFolio={i + 1} />
          </div>
        ))}
      </div>
    </div>
  );
}
