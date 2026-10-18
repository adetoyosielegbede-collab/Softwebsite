"use client";

import { useState } from "react";
import type { CaseStudy } from "@/lib/types";
import { EditableImage } from "./editable-image";

export function CaseList({ items }: { items: CaseStudy[] }) {
  const sectors = ["All", ...Array.from(new Set(items.map((item) => item.sector)))];
  const [sector, setSector] = useState("All");
  const visible = sector === "All" ? items : items.filter((item) => item.sector === sector);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {sectors.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setSector(item)}
            className={`rounded-full px-4 py-2 text-sm ${
              sector === item ? "bg-white text-black" : "bg-white/5 text-white/70 ring-1 ring-white/10"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="mt-10 text-white/60">No case studies in this sector yet.</p>
      ) : (
        <div className="mt-10 grid gap-6">
          {visible.map((item) => (
            <article key={item.slug} className="grid overflow-hidden rounded-[2rem] bg-white/5 ring-1 ring-white/10 md:grid-cols-[0.9fr_1.1fr]">
              <EditableImage media={item.image} className="min-h-64" />
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div>
                  <p className="text-sm text-accent">
                    {item.number} · {item.sector}
                  </p>
                  <h2 className="display mt-3 text-3xl md:text-4xl">{item.title}</h2>
                  <p className="mt-4 text-white/70">{item.summary}</p>
                </div>
                <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/10 pt-5">
                  <div>
                    <p className="display text-4xl">{item.metric}</p>
                    <p className="text-sm text-white/55">{item.metricLabel}</p>
                  </div>
                  <p className="text-sm text-white/55">Client · {item.client}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
