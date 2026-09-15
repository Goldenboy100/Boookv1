export interface Palette {
  id: string;
  name: string;
  bg: string;
  bg2: string;
  ink: string;
  accent: string;
  accent2: string;
}

export const PALETTES: Palette[] = [
  { id: "ink-paper", name: "Ink & Paper", bg: "#15141a", bg2: "#20202a", ink: "#f4ede0", accent: "#c9a24b", accent2: "#8a8397" },
  { id: "oxblood", name: "Oxblood", bg: "#4a1420", bg2: "#611b2a", ink: "#f6e7dd", accent: "#e0b27f", accent2: "#c98d8d" },
  { id: "emerald", name: "Emerald", bg: "#0d2b23", bg2: "#123a2f", ink: "#eef6ee", accent: "#d9b25f", accent2: "#7fb08a" },
  { id: "terracotta", name: "Terracotta", bg: "#a8482a", bg2: "#c05a35", ink: "#fdf3e6", accent: "#3a2418", accent2: "#e8b98f" },
  { id: "lavender", name: "Lavender", bg: "#312a4a", bg2: "#3f3660", ink: "#efeaff", accent: "#c9b6ff", accent2: "#9d90c4" },
  { id: "midnight", name: "Midnight", bg: "#0c1730", bg2: "#132246", ink: "#e8eefc", accent: "#6fa8ff", accent2: "#8ea0c4" },
  { id: "monochrome", name: "Monochrome", bg: "#f2f0eb", bg2: "#e2ded4", ink: "#16151a", accent: "#16151a", accent2: "#8b887f" },
  { id: "brass", name: "Brass", bg: "#241c0d", bg2: "#332812", ink: "#f6e9c8", accent: "#d9b25f", accent2: "#a9833a" },
  { id: "forest", name: "Forest", bg: "#1c2a1a", bg2: "#26391f", ink: "#eef2e4", accent: "#a9c46a", accent2: "#7f8f6a" },
  { id: "plum", name: "Plum", bg: "#2c1230", bg2: "#3d1942", ink: "#f4e4f2", accent: "#d98fc9", accent2: "#a97fb0" },
  { id: "slate", name: "Slate", bg: "#232a2e", bg2: "#2f383d", ink: "#eaf0f2", accent: "#7fb0b0", accent2: "#93a2a6" },
  { id: "cream", name: "Cream", bg: "#efe4cf", bg2: "#e3d4b8", ink: "#2b2318", accent: "#a8482a", accent2: "#8a7a5c" },
];

export const paletteById = (id: string): Palette =>
  PALETTES.find((p) => p.id === id) ?? PALETTES[0];

export interface CoverTemplate {
  id: string;
  name: string;
  note: string;
}

export const COVER_TEMPLATES: CoverTemplate[] = [
  { id: "classic", name: "Classic frame", note: "Rules and centered title, old-press feel" },
  { id: "minimal", name: "Minimal", note: "Quiet, bottom-aligned, modern" },
  { id: "deco", name: "Art deco", note: "Geometric borders and fan motifs" },
  { id: "vintage", name: "Vintage", note: "Ornamented frame, warm and worn" },
  { id: "typographic", name: "Typographic", note: "Title fills the whole cover" },
  { id: "split", name: "Two-tone split", note: "Bold diagonal color split" },
  { id: "photo", name: "Photograph", note: "Your own image with an ink overlay" },
  { id: "gradient", name: "Soft gradient", note: "Blended color wash" },
  { id: "band", name: "Band & label", note: "Horizontal band holding the title" },
];

export type PatternId = "none" | "diagonal" | "stripes" | "grid" | "dots" | "waves" | "arches" | "sunburst";

export const PATTERNS: { id: PatternId; name: string }[] = [
  { id: "none", name: "None" },
  { id: "diagonal", name: "Diagonal" },
  { id: "stripes", name: "Stripes" },
  { id: "grid", name: "Grid" },
  { id: "dots", name: "Dots" },
  { id: "waves", name: "Waves" },
  { id: "arches", name: "Arches" },
  { id: "sunburst", name: "Sunburst" },
];

/** CSS background for a pattern layer, given palette colors. */
export function patternCss(pattern: string, accent: string, accent2: string): string {
  const a = hexA(accent, 0.5);
  const b = hexA(accent2, 0.35);
  switch (pattern) {
    case "diagonal":
      return `repeating-linear-gradient(45deg, ${a} 0 2px, transparent 2px 16px)`;
    case "stripes":
      return `repeating-linear-gradient(180deg, ${a} 0 3px, transparent 3px 22px)`;
    case "grid":
      return `linear-gradient(${a} 1px, transparent 1px) 0 0/100% 26px, linear-gradient(90deg, ${a} 1px, transparent 1px) 0 0/26px 100%`;
    case "dots":
      return `radial-gradient(${a} 1.4px, transparent 1.5px) 0 0/20px 20px`;
    case "waves":
      return `radial-gradient(circle at 50% 120%, transparent 46%, ${b} 47%, ${b} 49%, transparent 50%) 0 0/44px 24px`;
    case "arches":
      return `radial-gradient(circle at 50% 0%, transparent 44%, ${a} 45%, ${a} 47%, transparent 48%) 0 0/34px 34px`;
    case "sunburst":
      return `repeating-conic-gradient(from 0deg at 50% 50%, ${a} 0deg 6deg, transparent 6deg 18deg)`;
    default:
      return "none";
  }
}

export function hexA(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
