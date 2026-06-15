/** Formats an ISO date string for display, with a short or long month name. */
export function formatDate(iso: string, style: "short" | "long" = "short"): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: style,
    day: "numeric",
    year: "numeric",
  });
}
