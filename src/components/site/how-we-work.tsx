"use client";

import { useState } from "react";
import type { HomeContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

export function HowWeWork({ content }: { content: HomeContent["howWeWork"] }) {
  const [active, setActive] = useState(0);
  const item = content.items[active] ?? content.items[0];
  if (!item) return null;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-24">
      <div>
        <p className="eyebrow mb-5">{content.eyebrow}</p>
        <div role="tablist" aria-label={content.eyebrow} className="border-t border-line">
          {content.items.map((it, i) => (
            <button
              key={it.label}
              role="tab"
              type="button"
              id={`hww-tab-${i}`}
              aria-selected={i === active}
              aria-controls="hww-panel"
              onClick={() => setActive(i)}
              className={cn(
                "relative flex w-full items-center gap-5 border-b border-line py-3.5 text-left transition-colors",
                i === active ? "text-ink" : "text-ink-faint hover:text-ink-soft",
              )}
            >
              <span className="font-mono text-[11px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-base">{it.label}</span>
              <span
                aria-hidden
                className={cn(
                  "absolute -bottom-px left-0 h-px bg-signal transition-[width] duration-500",
                  i === active ? "w-full" : "w-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      <div id="hww-panel" role="tabpanel" aria-labelledby={`hww-tab-${active}`} key={active} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        <h3 className="display text-4xl leading-tight lg:text-5xl">{item.title}</h3>
        <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft lg:text-base">{item.text}</p>
        <div className="mt-8">
          <PillLink href={content.ctaHref}>{content.ctaLabel}</PillLink>
        </div>
      </div>
    </div>
  );
}
