"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

export function FilterBar({
  categories,
  allLabel = "All",
  children,
}: {
  categories: string[];
  allLabel?: string;
  children: (active: string) => React.ReactNode;
}) {
  const [active, setActive] = useState(allLabel);
  const options = useMemo(() => [allLabel, ...categories], [allLabel, categories]);

  return (
    <>
      <div role="tablist" aria-label="Filter" className="no-scrollbar flex gap-2 overflow-x-auto">
        {options.map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={option === active}
            onClick={() => setActive(option)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors",
              option === active ? "bg-white text-black" : "bg-white/5 text-ink-soft ring-1 ring-line hover:text-ink",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {children(active)}
    </>
  );
}
