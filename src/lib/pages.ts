import type { PageKind, PageMeta } from "./types";

export const PAGE_CATALOG: PageMeta[] = [
  { kind: "half-title", label: "Half title", group: "front", hint: "Just the title, alone on a page, before anything else." },
  { kind: "title", label: "Title page", group: "front", hint: "Title, subtitle, author and imprint — the book's official face." },
  { kind: "copyright", label: "Copyright", group: "front", hint: "Edition, ISBN, rights, publisher and legal lines." },
  { kind: "dedication", label: "Dedication", group: "front", hint: "A short, personal line to one person." },
  { kind: "epigraph", label: "Epigraph", group: "front", hint: "A quotation that sets the tone for the book." },
  { kind: "contents", label: "Table of contents", group: "front", hint: "Auto-generated list of parts and chapters." },
  { kind: "foreword", label: "Foreword", group: "front", hint: "Written by someone else, introducing the book." },
  { kind: "preface", label: "Preface", group: "front", hint: "How and why the book came to be." },
  { kind: "introduction", label: "Introduction", group: "front", hint: "Orients the reader to the subject itself." },
  { kind: "part", label: "Part divider", group: "body", hint: "Groups chapters into a named part." },
  { kind: "chapter", label: "Chapter", group: "body", hint: "The main unit of your book." },
  { kind: "interlude", label: "Interlude", group: "body", hint: "A short break between chapters." },
  { kind: "epilogue", label: "Epilogue", group: "body", hint: "Catches up with the story after the end." },
  { kind: "appendix", label: "Appendix", group: "back", hint: "Supplementary material: tables, sources, extras." },
  { kind: "glossary", label: "Glossary", group: "back", hint: "Definitions of terms used in the book." },
  { kind: "acknowledgements", label: "Acknowledgements", group: "back", hint: "Thanks to the people who helped." },
  { kind: "about", label: "About the author", group: "back", hint: "A short biography." },
  { kind: "colophon", label: "Colophon", group: "back", hint: "How the book was made — typefaces, date, place." },
  { kind: "blank", label: "Blank page", group: "back", hint: "A spacer to control pagination." },
];

export const pageMeta = (kind: PageKind): PageMeta =>
  PAGE_CATALOG.find((p) => p.kind === kind) ?? PAGE_CATALOG[10];

export const groupLabel = (group: "front" | "body" | "back") =>
  ({ front: "Front matter", body: "The book", back: "Back matter" })[group];
