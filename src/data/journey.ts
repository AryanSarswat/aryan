export interface JourneySection {
  id: string;
  label: string;
  index: string;
}

/** The six fixed stops of the scroll journey. `id` doubles as the DOM anchor. */
export const JOURNEY: JourneySection[] = [
  { id: "hero", label: "Index", index: "00" },
  { id: "about", label: "About", index: "01" },
  { id: "writing", label: "Writing", index: "02" },
  { id: "work", label: "Work", index: "03" },
  { id: "career", label: "Career", index: "04" },
  { id: "contact", label: "Contact", index: "05" },
];

export const scrollToId = (id: string): void => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document
    .getElementById(id)
    ?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
};
