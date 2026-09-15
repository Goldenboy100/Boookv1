import type { Book } from "../lib/types";
import { fontStack } from "../lib/typography";
import { paletteById, patternCss, hexA } from "../lib/covers";

interface CoverProps {
  book: Book;
  width: number;
  className?: string;
  flat?: boolean;
}

/** Renders a book cover at the requested width (height = 1.5×width). */
export default function Cover({ book, width, className = "", flat = false }: CoverProps) {
  const height = Math.round(width * 1.5);
  const pal = paletteById(book.cover.palette);
  const titleFont = fontStack(book.cover.titleFont);
  const showAuthor = book.cover.showAuthor;
  const showSubtitle = book.cover.showSubtitle && !!book.subtitle;
  const img = book.cover.template === "photo" ? book.cover.customImage : null;

  const base: React.CSSProperties = {
    width,
    height,
    background: pal.bg,
    color: pal.ink,
    position: "relative",
    overflow: "hidden",
    fontFamily: titleFont,
    boxShadow: flat
      ? "inset 0 0 0 1px rgba(255,255,255,0.06)"
      : "0 18px 40px -18px rgba(0,0,0,0.8), 0 2px 10px rgba(0,0,0,0.4)",
    flex: "none",
  };

  const pattern = patternCss(book.cover.pattern, pal.accent, pal.accent2);

  const titleSize =
    book.cover.template === "typographic"
      ? Math.max(18, Math.min(width * 0.19, (width * 1.9) / Math.max(6, book.title.length || 6)))
      : width * 0.108;

  const frame = (inset: number, color: string, w = 1.5) => (
    <div
      style={{
        position: "absolute",
        inset,
        border: `${w}px solid ${color}`,
        pointerEvents: "none",
      }}
    />
  );

  const renderContent = () => {
    switch (book.cover.template) {
      case "minimal":
        return (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: width * 0.1 }}>
            <div style={{ height: 2, width: width * 0.16, background: pal.accent, marginBottom: width * 0.05 }} />
            <div style={{ fontSize: width * 0.098, lineHeight: 1.08, fontWeight: 500 }}>{book.title}</div>
            {showSubtitle && (
              <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.05, marginTop: width * 0.03, opacity: 0.82, fontStyle: "italic" }}>{book.subtitle}</div>
            )}
            {showAuthor && (
              <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.045, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: width * 0.07, opacity: 0.9 }}>{book.author}</div>
            )}
          </div>
        );

      case "deco":
        return (
          <>
            {frame(width * 0.05, pal.accent, 2)}
            {frame(width * 0.075, hexA(pal.accent, 0.5), 1)}
            <div style={{ position: "absolute", top: width * 0.11, left: "50%", transform: "translateX(-50%)", width: width * 0.5, height: width * 0.25, background: `repeating-linear-gradient(90deg, ${hexA(pal.accent, 0.55)} 0 2px, transparent 2px 10px)`, clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }} />
            <div style={{ position: "absolute", top: "42%", left: width * 0.09, right: width * 0.09, textAlign: "center" }}>
              <div style={{ fontSize: titleSize * 0.86, lineHeight: 1.02, textTransform: "uppercase", letterSpacing: "0.02em", fontWeight: 600 }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.048, marginTop: width * 0.03, fontStyle: "italic", opacity: 0.85 }}>{book.subtitle}</div>}
            </div>
            {showAuthor && <div style={{ position: "absolute", bottom: width * 0.13, left: 0, right: 0, textAlign: "center", fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.045, letterSpacing: "0.22em", textTransform: "uppercase", color: pal.accent }}>{book.author}</div>}
          </>
        );

      case "vintage":
        return (
          <>
            {frame(width * 0.06, pal.accent, 1.5)}
            {frame(width * 0.085, hexA(pal.accent, 0.4), 1)}
            <div style={{ position: "absolute", top: width * 0.09, left: width * 0.09, fontSize: width * 0.06, color: pal.accent }}>❧</div>
            <div style={{ position: "absolute", top: width * 0.09, right: width * 0.09, fontSize: width * 0.06, color: pal.accent, transform: "scaleX(-1)" }}>❧</div>
            <div style={{ position: "absolute", bottom: width * 0.09, left: width * 0.09, fontSize: width * 0.06, color: pal.accent, transform: "scaleY(-1)" }}>❧</div>
            <div style={{ position: "absolute", bottom: width * 0.09, right: width * 0.09, fontSize: width * 0.06, color: pal.accent, transform: "scale(-1,-1)" }}>❧</div>
            <div style={{ position: "absolute", top: "50%", left: width * 0.14, right: width * 0.14, transform: "translateY(-50%)", textAlign: "center" }}>
              <div style={{ fontSize: width * 0.045, letterSpacing: "0.3em", textTransform: "uppercase", color: pal.accent, marginBottom: width * 0.04 }}>A novel</div>
              <div style={{ fontSize: titleSize, lineHeight: 1.05, fontStyle: "italic" }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.048, marginTop: width * 0.03, opacity: 0.8 }}>{book.subtitle}</div>}
            </div>
            {showAuthor && <div style={{ position: "absolute", bottom: width * 0.2, left: 0, right: 0, textAlign: "center", fontSize: width * 0.048, letterSpacing: "0.06em" }}>{book.author}</div>}
          </>
        );

      case "typographic":
        return (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", padding: width * 0.07 }}>
            <div style={{ fontSize: titleSize, lineHeight: 0.95, fontWeight: 700, wordBreak: "break-word" }}>{book.title}</div>
            {showAuthor && <div style={{ position: "absolute", bottom: width * 0.07, left: width * 0.07, fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.05, letterSpacing: "0.1em", textTransform: "uppercase", color: pal.accent }}>{book.author}</div>}
          </div>
        );

      case "split":
        return (
          <>
            <div style={{ position: "absolute", inset: 0, background: pal.bg2, clipPath: "polygon(0 0, 100% 0, 100% 42%, 0 62%)" }} />
            <div style={{ position: "absolute", left: width * 0.09, right: width * 0.09, top: "16%" }}>
              <div style={{ fontSize: titleSize, lineHeight: 1.02, fontWeight: 700 }}>{book.title}</div>
            </div>
            <div style={{ position: "absolute", left: width * 0.09, right: width * 0.09, top: "66%" }}>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.052, fontStyle: "italic", opacity: 0.9 }}>{book.subtitle}</div>}
              {showAuthor && <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.045, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: width * 0.04, color: pal.accent }}>{book.author}</div>}
            </div>
          </>
        );

      case "photo":
        return (
          <>
            {!img && (
              <div style={{ position: "absolute", inset: 0, background: `linear-gradient(160deg, ${pal.bg2}, ${pal.bg})` }} />
            )}
            <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, ${hexA(pal.bg, 0.15)}, ${hexA(pal.bg, 0.85)})` }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: width * 0.09 }}>
              <div style={{ fontSize: width * 0.105, lineHeight: 1.05, fontWeight: 600, textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.05, marginTop: width * 0.025, fontStyle: "italic", opacity: 0.92 }}>{book.subtitle}</div>}
              {showAuthor && <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.043, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: width * 0.05, color: pal.accent }}>{book.author}</div>}
            </div>
          </>
        );

      case "gradient":
        return (
          <>
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: width * 0.1 }}>
              <div style={{ width: width * 0.14, height: 1, background: pal.accent, marginBottom: width * 0.05 }} />
              <div style={{ fontSize: titleSize, lineHeight: 1.06, fontWeight: 500 }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.05, marginTop: width * 0.03, fontStyle: "italic", opacity: 0.85 }}>{book.subtitle}</div>}
              {showAuthor && <div style={{ fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.043, letterSpacing: "0.18em", textTransform: "uppercase", marginTop: width * 0.08, opacity: 0.9 }}>{book.author}</div>}
            </div>
          </>
        );

      case "band":
        return (
          <>
            <div style={{ position: "absolute", top: "34%", left: 0, right: 0, height: width * 0.5, background: pal.accent }} />
            <div style={{ position: "absolute", top: "34%", left: 0, right: 0, height: width * 0.5, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: width * 0.08, color: pal.bg }}>
              <div style={{ fontSize: width * 0.095, lineHeight: 1.05, fontWeight: 700 }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.045, marginTop: width * 0.02, fontStyle: "italic" }}>{book.subtitle}</div>}
            </div>
            {showAuthor && <div style={{ position: "absolute", bottom: width * 0.1, left: 0, right: 0, textAlign: "center", fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.045, letterSpacing: "0.16em", textTransform: "uppercase" }}>{book.author}</div>}
          </>
        );

      case "classic":
      default:
        return (
          <>
            {frame(width * 0.055, pal.accent, 1.5)}
            <div style={{ position: "absolute", top: "22%", left: width * 0.1, right: width * 0.1, textAlign: "center" }}>
              <div style={{ fontSize: titleSize, lineHeight: 1.08, fontWeight: 500 }}>{book.title}</div>
              {showSubtitle && <div style={{ fontFamily: "Georgia, serif", fontSize: width * 0.052, marginTop: width * 0.035, fontStyle: "italic", opacity: 0.85 }}>{book.subtitle}</div>}
            </div>
            <div style={{ position: "absolute", top: "52%", left: "32%", right: "32%", height: 3, borderTop: `1px solid ${pal.accent}`, borderBottom: `1px solid ${pal.accent}` }} />
            {showAuthor && <div style={{ position: "absolute", top: "58%", left: width * 0.08, right: width * 0.08, textAlign: "center", fontFamily: "Instrument Sans, sans-serif", fontSize: width * 0.05, letterSpacing: "0.14em", textTransform: "uppercase" }}>{book.author}</div>}
          </>
        );
    }
  };

  return (
    <div className={className} style={base} aria-label={`Cover of ${book.title}`}>
      {book.cover.template === "photo" && img && (
        <img src={img} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      )}
      {book.cover.template === "gradient" && (
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 20% 10%, ${pal.bg2}, ${pal.bg})` }} />
      )}
      {pattern !== "none" && (
        <div style={{ position: "absolute", inset: 0, backgroundImage: pattern, opacity: 0.5, mixBlendMode: "overlay" }} />
      )}
      {renderContent()}
      {/* spine shading */}
      {!flat && (
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(90deg, rgba(0,0,0,0.35), transparent 6%, transparent 94%, rgba(0,0,0,0.12))`, pointerEvents: "none" }} />
      )}
    </div>
  );
}
