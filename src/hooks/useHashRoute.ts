import { useState, useEffect } from "react";

export type RouteType =
  | "home"
  | "about"
  | "writing"
  | "article"
  | "work"
  | "career"
  | "skills"
  | "contact";

export interface Route {
  type: RouteType;
  slug?: string;
}

export function useHashRoute(): string {
  const [hash, setHash] = useState(() => window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash;
}

export function parseRoute(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (!h) return { type: "home" };
  const parts = h.split("/").filter(Boolean);
  if (parts[0] === "writing") {
    if (parts[1]) return { type: "article", slug: parts[1] };
    return { type: "writing" };
  }
  const validTypes: RouteType[] = ["about", "work", "career", "skills", "contact"];
  if (validTypes.includes(parts[0] as RouteType)) {
    return { type: parts[0] as RouteType };
  }
  return { type: "home" };
}
