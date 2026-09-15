export type Role = "admin" | "reader";

export interface User {
  username: string;
  role: Role;
}

export type Storage = "browser" | "database";

export type PageKind =
  | "half-title"
  | "title"
  | "copyright"
  | "dedication"
  | "epigraph"
  | "contents"
  | "foreword"
  | "preface"
  | "introduction"
  | "part"
  | "chapter"
  | "interlude"
  | "epilogue"
  | "appendix"
  | "glossary"
  | "acknowledgements"
  | "about"
  | "colophon"
  | "blank";

export type PartGroup = "front" | "body" | "back";

export interface Page {
  id: string;
  kind: PageKind;
  title: string;
  text: string;
  /** Page-specific font size multiplier (0.65 – 2.0). 1 = book default. */
  fontScale: number;
}

export interface CoverStyle {
  template: string;
  palette: string;
  pattern: string;
  titleFont: string;
  showAuthor: boolean;
  showSubtitle: boolean;
  customImage?: string | null;
}

export interface InteriorStyle {
  bodyFont: string;
  fontScale: number;
  lineHeight: number;
  margin: "narrow" | "normal" | "wide";
  justify: boolean;
  dropCaps: boolean;
  sceneBreak: "ornament" | "stars" | "rule" | "space";
  folio: "bottom" | "top" | "none";
}

export interface Book {
  id: string;
  title: string;
  subtitle: string;
  author: string;
  language: string;
  description: string;
  storage: Storage;
  cover: CoverStyle;
  interior: InteriorStyle;
  pages: Page[];
  createdAt: number;
  updatedAt: number;
}

export interface PageMeta {
  kind: PageKind;
  label: string;
  group: PartGroup;
  hint: string;
}
