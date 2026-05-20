export interface Musing {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  tags: string[];
  description: string;
  featured?: boolean;
  content: string;
}

function parseFrontmatter(raw: string, slug: string): Musing {
  const parts = raw.split("---");
  const fm = parts[1] ?? "";
  const content = parts.slice(2).join("---").trim();

  const get = (key: string): string => {
    const m = fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"));
    return m ? m[1].trim() : "";
  };

  const tagsLine = get("tags");
  const tags = tagsLine
    .replace(/^\[|\]$/g, "")
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  return {
    slug,
    title: get("title"),
    date: get("date"),
    readTime: get("readTime") || "5 min",
    tags,
    description: get("description"),
    featured: get("featured") === "true",
    content,
  };
}

const rawFiles = import.meta.glob("../content/musings/*/index.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

export const musings: Musing[] = Object.entries(rawFiles)
  .map(([path, raw]) => {
    const match = path.match(/\/musings\/([^/]+)\/index\.md$/);
    const slug = match ? match[1] : "";
    return parseFrontmatter(raw, slug);
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
