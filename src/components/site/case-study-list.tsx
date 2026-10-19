"use client";

import { useState } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { CaseStudiesContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

export function CaseStudyList({ items, filters }: { items: CaseStudiesContent["items"]; filters: string[] }) {
  const [active, setActive] = useState("All");
  const total = String(items.length).padStart(2, "0");
  const visible = items
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => active === "All" || item.tag === active);

  return (
    <>
      <div role="tablist" aria-label="Filter case studies" className="no-scrollbar flex gap-2 overflow-x-auto">
        {["All", ...filters].map((option) => (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={option === active}
            onClick={() => setActive(option)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-colors",
              option === active ? "bg-ink text-paper" : "bg-surface-raised text-ink-soft hover:text-ink",
            )}
          >
            {option}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-12 text-sm text-ink-soft">No case studies in this category yet.</p>
      ) : (
        <ol className="mt-10 grid gap-4 lg:grid-cols-2">
          {visible.map(({ item, index }) => (
            <li key={item.title} className="flex flex-col rounded-3xl bg-surface p-6 lg:p-8">
              <div className="flex items-start justify-between gap-4">
                <span className="grid h-14 min-w-14 place-items-center rounded-2xl bg-brand px-3 font-heading text-xl font-light text-signal">
                  {String(index + 1).padStart(2, "0")} / {total}
                </span>
                <span className="rounded-full bg-signal/15 px-3 py-1 text-[11px] font-medium text-signal">{item.tag}</span>
              </div>
              <h2 className="text-title mt-8">{item.title}</h2>
              <p className="text-body mt-4 flex-1 text-ink-soft">{item.text}</p>
              <div className={cn("relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl", !item.image.src && "hidden [.cms-editing_&]:block")}>
                <CmsImage image={item.image} file="case-studies" path={`items.${index}.image`} sizes="(min-width: 1024px) 50vw, 100vw" emptyClassName="absolute inset-0" />
              </div>
              <div className="mt-8 flex items-end justify-between gap-4 rounded-2xl bg-paper/70 p-5 ring-1 ring-line">
                <div>
                  <p className="font-heading text-5xl leading-[0.9] font-light">{item.metric}</p>
                  <p className="text-body mt-1 text-ink-soft">{item.metricLabel}</p>
                </div>
                <p className="max-w-[180px] text-right text-xs leading-relaxed text-ink-soft">
                  <span className="block text-[10px] tracking-wider text-ink-faint uppercase">Client</span>
                  {item.client}
                </p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}
