import "server-only";
import { cache } from "react";
import { readBundledContent } from "@/lib/cms/storage";
import type { ContentMap, Post } from "@/lib/content-types";

export const getContent = cache(async <K extends keyof ContentMap>(id: K): Promise<ContentMap[K]> => {
  return readBundledContent<ContentMap[K]>(id);
});

/** Published posts, newest first. `index` is the post's position in posts.json (for CMS image paths). */
export async function getPublishedPosts(): Promise<(Post & { index: number })[]> {
  const { items } = await getContent("posts");
  return items
    .map((p, index) => ({ ...p, index }))
    .filter((p) => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}
