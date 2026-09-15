export interface FontDef {
  id: string;
  family: string;
  label: string;
  group: "latin" | "script";
  script: string;
  note?: string;
  weights?: number[];
  italic?: boolean;
}

/** Title / display faces. */
export const TITLE_FONTS: FontDef[] = [
  { id: "fraunces", family: '"Fraunces", Georgia, serif', label: "Fraunces", group: "latin", script: "Latin", note: "Warm, high-contrast display serif", weights: [400, 600, 700, 900], italic: true },
  { id: "playfair", family: '"Playfair Display", Georgia, serif', label: "Playfair Display", group: "latin", script: "Latin", note: "Elegant transitional contrast", weights: [400, 600, 800, 900], italic: true },
  { id: "dm-serif", family: '"DM Serif Display", Georgia, serif', label: "DM Serif Display", group: "latin", script: "Latin", note: "Bold editorial serif", weights: [400], italic: true },
  { id: "cormorant", family: '"Cormorant Garamond", Georgia, serif', label: "Cormorant Garamond", group: "latin", script: "Latin", note: "Delicate, airy old-style", weights: [300, 500, 700], italic: true },
  { id: "abril", family: '"Abril Fatface", Georgia, serif', label: "Abril Fatface", group: "latin", script: "Latin", note: "Fat didone poster face", weights: [400] },
  { id: "bebas", family: '"Bebas Neue", Impact, sans-serif', label: "Bebas Neue", group: "latin", script: "Latin", note: "Tall condensed caps", weights: [400] },
  { id: "yeseva", family: '"Yeseva One", Georgia, serif', label: "Yeseva One", group: "latin", script: "Latin", note: "Romantic high-contrast", weights: [400] },
  { id: "unbounded", family: '"Unbounded", sans-serif', label: "Unbounded", group: "latin", script: "Latin", note: "Wide, geometric, modern", weights: [300, 500, 800] },
  { id: "poiret", family: '"Poiret One", sans-serif', label: "Poiret One", group: "latin", script: "Latin", note: "Art-deco elegance", weights: [400] },
  { id: "josefin", family: '"Josefin Sans", sans-serif', label: "Josefin Sans", group: "latin", script: "Latin", note: "Geometric vintage sans", weights: [300, 500, 700] },
  { id: "bricolage", family: '"Bricolage Grotesque", sans-serif', label: "Bricolage Grotesque", group: "latin", script: "Latin", note: "Quirky contemporary grotesk", weights: [400, 600, 800] },
  { id: "noto-serif-title", family: '"Noto Serif", Georgia, serif', label: "Noto Serif", group: "latin", script: "Latin", note: "Universal, screen-tuned serif", weights: [400, 600, 800], italic: true },
  { id: "instrument", family: '"Instrument Sans", sans-serif', label: "Instrument Sans", group: "latin", script: "Latin", note: "Neutral modern sans", weights: [400, 600, 700] },
  // Script display faces
  { id: "kufi-ar", family: '"Noto Kufi Arabic", serif', label: "Noto Kufi Arabic", group: "script", script: "Arabic", note: "Geometric Kufi", weights: [400, 700] },
  { id: "nastaliq-ur", family: '"Noto Nastaliq Urdu", serif', label: "Nastaliq Urdu", group: "script", script: "Nastaliq", note: "Calligraphic Nastaliq", weights: [400, 700] },
  { id: "hebrew", family: '"Noto Serif Hebrew", serif', label: "Noto Serif Hebrew", group: "script", script: "Hebrew", weights: [400, 700] },
  { id: "devanagari", family: '"Noto Serif Devanagari", serif', label: "Noto Serif Devanagari", group: "script", script: "Devanagari", weights: [400, 700] },
  { id: "bengali", family: '"Noto Serif Bengali", serif', label: "Noto Serif Bengali", group: "script", script: "Bengali", weights: [400, 700] },
  { id: "gurmukhi", family: '"Noto Serif Gurmukhi", serif', label: "Noto Serif Gurmukhi", group: "script", script: "Gurmukhi", weights: [400, 700] },
  { id: "gujarati", family: '"Noto Serif Gujarati", serif', label: "Noto Serif Gujarati", group: "script", script: "Gujarati", weights: [400, 700] },
  { id: "tamil", family: '"Noto Serif Tamil", serif', label: "Noto Serif Tamil", group: "script", script: "Tamil", weights: [400, 700] },
  { id: "telugu", family: '"Noto Serif Telugu", serif', label: "Noto Serif Telugu", group: "script", script: "Telugu", weights: [400, 700] },
  { id: "kannada", family: '"Noto Serif Kannada", serif', label: "Noto Serif Kannada", group: "script", script: "Kannada", weights: [400, 700] },
  { id: "malayalam", family: '"Noto Serif Malayalam", serif', label: "Noto Serif Malayalam", group: "script", script: "Malayalam", weights: [400, 700] },
  { id: "sinhala", family: '"Noto Serif Sinhala", serif', label: "Noto Serif Sinhala", group: "script", script: "Sinhala", weights: [400, 700] },
  { id: "myanmar", family: '"Noto Serif Myanmar", serif', label: "Noto Serif Myanmar", group: "script", script: "Myanmar", weights: [400, 700] },
  { id: "khmer", family: '"Noto Serif Khmer", serif', label: "Noto Serif Khmer", group: "script", script: "Khmer", weights: [400, 700] },
  { id: "lao", family: '"Noto Serif Lao", serif', label: "Noto Serif Lao", group: "script", script: "Lao", weights: [400, 700] },
  { id: "thai", family: '"Noto Serif Thai", serif', label: "Noto Serif Thai", group: "script", script: "Thai", weights: [400, 700] },
  { id: "georgian", family: '"Noto Serif Georgian", serif', label: "Noto Serif Georgian", group: "script", script: "Georgian", weights: [400, 700] },
  { id: "armenian", family: '"Noto Serif Armenian", serif', label: "Noto Serif Armenian", group: "script", script: "Armenian", weights: [400, 700] },
  { id: "ethiopic", family: '"Noto Serif Ethiopic", serif', label: "Noto Serif Ethiopic", group: "script", script: "Ethiopic", weights: [400, 700] },
  { id: "jp", family: '"Noto Serif JP", serif', label: "Noto Serif JP", group: "script", script: "Japanese", weights: [400, 700] },
  { id: "kr", family: '"Noto Serif KR", serif', label: "Noto Serif KR", group: "script", script: "Korean", weights: [400, 700] },
  { id: "sc", family: '"Noto Serif SC", serif', label: "Noto Serif SC", group: "script", script: "Han", weights: [400, 700] },
  { id: "tc", family: '"Noto Serif TC", serif', label: "Noto Serif TC", group: "script", script: "Han", weights: [400, 700] },
];

/** Body / interior faces. */
export const BODY_FONTS: FontDef[] = [
  { id: "literata", family: '"Literata", Georgia, serif', label: "Literata", group: "latin", script: "Latin", note: "Friendly reading serif", weights: [400, 500, 600], italic: true },
  { id: "eb-garamond", family: '"EB Garamond", Georgia, serif', label: "EB Garamond", group: "latin", script: "Latin", note: "Old-style classic", weights: [400, 500, 600], italic: true },
  { id: "cormorant", family: '"Cormorant Garamond", Georgia, serif', label: "Cormorant Garamond", group: "latin", script: "Latin", note: "Light & elegant", weights: [300, 400, 600], italic: true },
  { id: "baskerville", family: '"Libre Baskerville", Georgia, serif', label: "Libre Baskerville", group: "latin", script: "Latin", note: "Crisp transitional", weights: [400, 700], italic: true },
  { id: "noto-serif", family: '"Noto Serif", Georgia, serif', label: "Noto Serif", group: "latin", script: "Latin", note: "Universal serif, full charset", weights: [400, 500, 600], italic: true },
  { id: "fraunces-body", family: '"Fraunces", Georgia, serif', label: "Fraunces", group: "latin", script: "Latin", note: "Warm literary serif", weights: [400, 500], italic: true },
  { id: "instrument-body", family: '"Instrument Sans", sans-serif', label: "Instrument Sans", group: "latin", script: "Latin", note: "Modern sans body", weights: [400, 500] },
  // Script bodies
  { id: "naskh-ar", family: '"Noto Naskh Arabic", serif', label: "Noto Naskh Arabic", group: "script", script: "Arabic", note: "Classical Naskh", weights: [400, 500, 700] },
  { id: "kufi-ar", family: '"Noto Kufi Arabic", serif', label: "Noto Kufi Arabic", group: "script", script: "Arabic", note: "Modern Kufi", weights: [400, 700] },
  { id: "nastaliq-ur", family: '"Noto Nastaliq Urdu", serif', label: "Nastaliq Urdu", group: "script", script: "Nastaliq", weights: [400, 700] },
  { id: "hebrew", family: '"Noto Serif Hebrew", serif', label: "Noto Serif Hebrew", group: "script", script: "Hebrew", weights: [400, 700] },
  { id: "devanagari", family: '"Noto Serif Devanagari", serif', label: "Noto Serif Devanagari", group: "script", script: "Devanagari", weights: [400, 700] },
  { id: "bengali", family: '"Noto Serif Bengali", serif', label: "Noto Serif Bengali", group: "script", script: "Bengali", weights: [400, 700] },
  { id: "gurmukhi", family: '"Noto Serif Gurmukhi", serif', label: "Noto Serif Gurmukhi", group: "script", script: "Gurmukhi", weights: [400, 700] },
  { id: "gujarati", family: '"Noto Serif Gujarati", serif', label: "Noto Serif Gujarati", group: "script", script: "Gujarati", weights: [400, 700] },
  { id: "tamil", family: '"Noto Serif Tamil", serif', label: "Noto Serif Tamil", group: "script", script: "Tamil", weights: [400, 700] },
  { id: "telugu", family: '"Noto Serif Telugu", serif', label: "Noto Serif Telugu", group: "script", script: "Telugu", weights: [400, 700] },
  { id: "kannada", family: '"Noto Serif Kannada", serif', label: "Noto Serif Kannada", group: "script", script: "Kannada", weights: [400, 700] },
  { id: "malayalam", family: '"Noto Serif Malayalam", serif', label: "Noto Serif Malayalam", group: "script", script: "Malayalam", weights: [400, 700] },
  { id: "sinhala", family: '"Noto Serif Sinhala", serif', label: "Noto Serif Sinhala", group: "script", script: "Sinhala", weights: [400, 700] },
  { id: "myanmar", family: '"Noto Serif Myanmar", serif', label: "Noto Serif Myanmar", group: "script", script: "Myanmar", weights: [400, 700] },
  { id: "khmer", family: '"Noto Serif Khmer", serif', label: "Noto Serif Khmer", group: "script", script: "Khmer", weights: [400, 700] },
  { id: "lao", family: '"Noto Serif Lao", serif', label: "Noto Serif Lao", group: "script", script: "Lao", weights: [400, 700] },
  { id: "thai", family: '"Noto Serif Thai", serif', label: "Noto Serif Thai", group: "script", script: "Thai", weights: [400, 700] },
  { id: "georgian", family: '"Noto Serif Georgian", serif', label: "Noto Serif Georgian", group: "script", script: "Georgian", weights: [400, 700] },
  { id: "armenian", family: '"Noto Serif Armenian", serif', label: "Noto Serif Armenian", group: "script", script: "Armenian", weights: [400, 700] },
  { id: "ethiopic", family: '"Noto Serif Ethiopic", serif', label: "Noto Serif Ethiopic", group: "script", script: "Ethiopic", weights: [400, 700] },
  { id: "jp", family: '"Noto Serif JP", serif', label: "Noto Serif JP", group: "script", script: "Japanese", weights: [400, 700] },
  { id: "kr", family: '"Noto Serif KR", serif', label: "Noto Serif KR", group: "script", script: "Korean", weights: [400, 700] },
  { id: "sc", family: '"Noto Serif SC", serif', label: "Noto Serif SC", group: "script", script: "Han", weights: [400, 700] },
  { id: "tc", family: '"Noto Serif TC", serif', label: "Noto Serif TC", group: "script", script: "Han", weights: [400, 700] },
];

const allFonts = [...TITLE_FONTS, ...BODY_FONTS];

export function fontById(id: string): FontDef {
  return (
    allFonts.find((f) => f.id === id) ??
    allFonts.find((f) => f.id === "literata") ??
    allFonts[0]
  );
}

export function fontStack(id: string): string {
  return fontById(id).family;
}
