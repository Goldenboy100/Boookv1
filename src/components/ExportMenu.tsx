import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { Book } from "../lib/types";
import { exportEpub, exportMarkdown, exportBookJson } from "../lib/export";
import { Download, FileText, BookOpen, Code, ChevronDown } from "lucide-react";

export default function ExportMenu({ book, align = "right" }: { book: Book; align?: "left" | "right" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const run = (fn: () => void | Promise<void>) => {
    setOpen(false);
    void fn();
  };

  return (
    <div className="relative" ref={ref}>
      <button className="btn" onClick={() => setOpen((o) => !o)}>
        <Download size={15} /> Export <ChevronDown size={13} className="opacity-60" />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 w-56 overflow-hidden rounded-lg border border-ink-600 bg-ink-850 shadow-2xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <MenuItem icon={<FileText size={15} />} title="PDF" desc="Print or save as PDF" onClick={() => navigate(`/print/${book.id}`)} />
          <MenuItem icon={<BookOpen size={15} />} title="EPUB" desc="E-book for readers" onClick={() => run(() => exportEpub(book))} />
          <MenuItem icon={<Code size={15} />} title="Markdown" desc="Clean .md manuscript" onClick={() => run(() => exportMarkdown(book))} />
          <MenuItem icon={<Download size={15} />} title="Book file" desc="Back up as .quire.json" onClick={() => run(() => exportBookJson(book))} />
        </div>
      )}
    </div>
  );
}

function MenuItem({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick: () => void }) {
  return (
    <button onClick={onClick} className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-ink-800">
      <span className="text-brass-300">{icon}</span>
      <span>
        <span className="block text-sm text-ink-100">{title}</span>
        <span className="block text-[11px] text-ink-500">{desc}</span>
      </span>
    </button>
  );
}
