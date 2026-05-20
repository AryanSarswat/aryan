export interface PageInfo {
  id: string;
  label: string;
  path: string;
}

export const PAGE_SEQUENCE: PageInfo[] = [
  { id: "home", label: "Home", path: "" },
  { id: "about", label: "About", path: "/about" },
  { id: "writing", label: "Writing", path: "/writing" },
  { id: "work", label: "Work", path: "/work" },
  { id: "career", label: "Career", path: "/career" },
  { id: "skills", label: "Skills", path: "/skills" },
  { id: "contact", label: "Contact", path: "/contact" },
];

export function getPageNeighbors(currentId: string) {
  const idx = PAGE_SEQUENCE.findIndex((p) => p.id === currentId);
  if (idx === -1)
    return { prev: null, next: null, current: null, idx: 0, total: PAGE_SEQUENCE.length };
  return {
    current: PAGE_SEQUENCE[idx],
    prev: idx > 0 ? PAGE_SEQUENCE[idx - 1] : null,
    next: idx < PAGE_SEQUENCE.length - 1 ? PAGE_SEQUENCE[idx + 1] : null,
    idx,
    total: PAGE_SEQUENCE.length,
  };
}
