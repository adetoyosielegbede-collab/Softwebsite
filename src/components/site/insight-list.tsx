"use client";

import { useState } from "react";
import { InsightCard } from "@/components/site/insight-card";
import type { Post } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export function InsightList({
  posts,
  categories,
  featuredTitle: _featuredTitle,
  moreTitle: _moreTitle,
  emptyText,
}: {
  posts: (Post & { index: number })[];
  categories: string[];
  featuredTitle: string;
  moreTitle: string;
  emptyText: string;
}) {
  const [active, setActive] = useState("All");
  const matching = posts.filter((p) => active === "All" || p.category === active);
  const featured = matching.find((p) => p.featured) ?? (active === "All" ? matching[0] : undefined);
  const rest = matching.filter((p) => p !== featured);
  const ordered = featured ? [featured, ...rest] : matching;

  return (
    <>
      <div role="tablist" aria-label="Filter insights" className="no-scrollbar flex gap-2 overflow-x-auto">
        {["All", ...categories].map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={option === active}
            onClick={() => setActive(option)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors",
              option === active ? "bg-ink text-paper" : "bg-ink/5 text-ink-soft ring-1 ring-line hover:text-ink",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {matching.length === 0 && <p className="mt-12 text-sm text-ink-soft">{emptyText}</p>}
      {ordered.length > 0 && (
        <div
          className={cn(
            "mt-12 grid gap-x-10 gap-y-12",
            ordered.length > 2 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2",
          )}
        >
          {ordered.map((post) => (
            <InsightCard key={post.slug} post={post} index={post.index} />
          ))}
        </div>
      )}
    </>
  );
}
