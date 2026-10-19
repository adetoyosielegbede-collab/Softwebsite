"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import type { CaseStudiesContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

type Item = CaseStudiesContent["items"][number];

function excerpt(text: string) {
  const sentence = text.split(/(?<=\.)\s/)[0] ?? text;
  return sentence.length > 148 ? `${sentence.slice(0, 145).trim()}…` : sentence;
}

function studyId(index: number) {
  return `study-${index}`;
}

export function CaseStudyList({ items, filters }: { items: CaseStudiesContent["items"]; filters: string[] }) {
  const [filter, setFilter] = useState("All");
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const total = String(items.length).padStart(2, "0");
  const visible = items.map((item, index) => ({ item, index })).filter(({ item }) => filter === "All" || item.tag === filter);
  const openItem = selected !== null ? items[selected] : null;

  useEffect(() => {
    const root = listRef.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-study]")];
    if (cards.length === 0) return;

    const pick = () => {
      const mid = window.innerHeight * 0.46;
      let best = cards[0];
      let bestDist = Infinity;
      for (const card of cards) {
        const rect = card.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
        const dist = Math.abs(rect.top + rect.height / 2 - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = card;
        }
      }
      const next = Number(best.dataset.index);
      setCurrent((value) => (value === next ? value : next));
    };

    pick();
    const observer = new IntersectionObserver(pick, { threshold: [0.35, 0.6] });
    cards.forEach((card) => observer.observe(card));
    window.addEventListener("scroll", pick, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", pick);
    };
  }, [filter, items]);

  useEffect(() => {
    setCurrent((value) => {
      const item = items[value];
      if (item && (filter === "All" || item.tag === filter)) return value;
      const first = items.findIndex((entry) => filter === "All" || entry.tag === filter);
      return first === -1 ? value : first;
    });
    setSelected((value) => {
      if (value === null) return value;
      const item = items[value];
      if (item && (filter === "All" || item.tag === filter)) return value;
      return null;
    });
  }, [filter, items]);

  function jumpTo(index: number) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const card = document.getElementById(studyId(index));
    card?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    card?.querySelector<HTMLButtonElement>("[data-open-study]")?.focus({ preventScroll: true });
    setCurrent(index);
  }

  return (
    <>
      <div className="lg:flex lg:items-stretch lg:gap-12">
        <aside className="lg:w-[210px] lg:shrink-0">
          <div className="sticky top-24 z-20 bg-paper/90 pb-4 backdrop-blur-md lg:pb-0">
            <div role="tablist" aria-label="Filter case studies" className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 lg:mx-0 lg:flex-wrap lg:px-0">
              {["All", ...filters].map((option) => (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={option === filter}
                  onClick={() => setFilter(option)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-1 text-[11px] transition-colors",
                    option === filter ? "bg-ink text-paper" : "bg-surface-raised text-ink-soft hover:text-ink",
                  )}
                >
                  {option}
                </button>
              ))}
            </div>
            <nav aria-label="Case studies" className="mt-4">
              <ul className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 lg:mx-0 lg:flex-col lg:gap-2 lg:overflow-visible lg:px-0">
                {visible.map(({ item, index }) => {
                  const on = index === current;
                  return (
                    <li key={item.title}>
                      <button
                        type="button"
                        onClick={() => jumpTo(index)}
                        aria-current={on ? "true" : undefined}
                        className={cn(
                          "block border-l py-1.5 pl-3 text-left font-mono text-[0.75rem] leading-snug font-medium transition-opacity whitespace-nowrap lg:whitespace-normal",
                          on ? "border-signal text-ink opacity-100" : "border-transparent text-ink-soft opacity-55 hover:opacity-80",
                        )}
                      >
                        <span className="mr-2 text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                        {item.client}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </aside>

        <ol ref={listRef} className="mt-6 flex min-w-0 flex-1 flex-col gap-3 lg:mt-0">
          {visible.length === 0 ? (
            <li className="text-body text-ink-soft">No case studies in this category yet.</li>
          ) : (
            visible.map(({ item, index }) => (
              <StudyCard
                key={item.title}
                item={item}
                index={index}
                total={total}
                onOpen={() => setSelected(index)}
              />
            ))
          )}
        </ol>
      </div>

      <Sheet open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <SheetContent
          side="right"
          showCloseButton={false}
          className="data-[side=right]:w-full data-[side=right]:sm:max-w-[640px] gap-0 overflow-y-auto bg-paper p-5 sm:p-8"
        >
          {openItem && selected !== null ? (
            <article>
              <div className="flex items-start justify-between gap-6">
                <p className="label text-ink-faint">
                  {String(selected + 1).padStart(2, "0")} / {total}
                </p>
                <SheetClose className="label rounded-full px-3 py-1 text-ink ring-1 ring-line">Close</SheetClose>
              </div>
              <SheetTitle className="mt-4 max-w-[18ch] font-heading text-[1.75rem] leading-none font-medium">{openItem.title}</SheetTitle>
              <SheetDescription className="sr-only">{excerpt(openItem.text)}</SheetDescription>
              <div className={cn("relative mt-6 aspect-[16/8] overflow-hidden rounded-2xl bg-neutral-900", !openItem.image.src && "hidden [.cms-editing_&]:block")}>
                <CmsImage image={openItem.image} file="case-studies" path={`items.${selected}.image`} sizes="640px" emptyClassName="absolute inset-0" />
              </div>
              <dl className="mt-6 grid grid-cols-2 overflow-hidden rounded-2xl bg-surface ring-1 ring-line sm:grid-cols-3">
                <div className="border-b border-line p-4 sm:border-r">
                  <dt className="label text-ink-faint">Outcome</dt>
                  <dd className="mt-2 font-heading text-2xl leading-none font-medium">{openItem.metric}</dd>
                  <dd className="text-body mt-2 text-ink-soft">{openItem.metricLabel}</dd>
                </div>
                <div className="border-b border-line p-4 sm:border-r">
                  <dt className="label text-ink-faint">Sector</dt>
                  <dd className="text-body mt-2">{openItem.tag}</dd>
                </div>
                <div className="col-span-2 border-line p-4 sm:col-span-1 sm:border-b-0">
                  <dt className="label text-ink-faint">Client</dt>
                  <dd className="text-body mt-2">{openItem.client}</dd>
                </div>
              </dl>
              <p className="text-body mt-6 text-ink-soft">{openItem.text}</p>
            </article>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}

function PinnedMark({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const card = el?.closest<HTMLElement>("[data-study]");
    if (!el || !card) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      if (reduced.matches) {
        el.style.transform = "";
        return;
      }
      const cardRect = card.getBoundingClientRect();
      const height = el.offsetHeight;
      const natural = cardRect.top + (cardRect.height - height) / 2;
      const hold = Math.min(220, window.innerHeight * 0.36);
      let top = natural;
      if (top < hold) top = hold;
      const floor = cardRect.top + 12;
      const limit = cardRect.bottom - height - 88;
      if (top > limit) top = limit;
      if (top < floor) top = floor;
      el.style.transform = `translate3d(0, ${Math.round(top - natural)}px, 0)`;
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 pr-4 text-right md:pr-8">
      <div ref={ref}>{children}</div>
    </div>
  );
}

function StudyCard({ item, index, total, onOpen }: { item: Item; index: number; total: string; onOpen: () => void }) {
  const number = `${String(index + 1).padStart(2, "0")} / ${total}`;
  return (
    <li
      id={studyId(index)}
      data-study=""
      data-index={index}
      className="group relative h-[300px] scroll-mt-36 overflow-hidden rounded-[20px] md:h-[360px]"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[20px] bg-neutral-950">
        <CmsImage
          image={item.image}
          file="case-studies"
          path={`items.${index}.image`}
          sizes="(min-width: 1024px) 70vw, 100vw"
          className="opacity-70"
          emptyClassName="hidden"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/35" />
      </div>
      <span aria-hidden className="pointer-events-none absolute top-3 left-3 z-10 size-3 border-t border-l border-white/35 md:size-5" />
      <span aria-hidden className="pointer-events-none absolute top-3 right-3 z-10 size-3 border-t border-r border-white/35 md:size-5" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 z-10 size-3 border-b border-l border-white/35 md:size-5" />
      <span aria-hidden className="pointer-events-none absolute right-3 bottom-3 z-10 size-3 border-r border-b border-white/35 md:size-5" />

      <div className="relative flex h-full flex-col p-4 text-white md:p-6">
        <div className="flex items-start justify-between gap-4">
          <h2 className="max-w-[24ch] font-heading text-xl leading-none font-medium md:text-2xl">{item.title}</h2>
          <span className="label shrink-0 text-white/70">{number}</span>
        </div>
        <p className="mt-3 max-w-[36ch] border-t border-white/25 pt-3 text-[0.8125rem] leading-[1.35] text-white/70">{excerpt(item.text)}</p>
        <button
          type="button"
          data-open-study=""
          onClick={onOpen}
          className="mt-4 flex w-fit items-center gap-2.5 font-mono text-[0.75rem] font-medium tracking-normal text-white uppercase"
        >
          <span
            aria-hidden
            className="size-2.5 -translate-x-3 rounded-[3px] bg-current opacity-0 blur-md transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 group-hover:blur-none max-md:translate-x-0 max-md:opacity-100 max-md:blur-none"
          />
          <span className="-translate-x-3 transition-transform duration-500 group-hover:translate-x-0 max-md:translate-x-0">Read the study</span>
        </button>

        <PinnedMark>
          <p className="font-heading text-[2.25rem] leading-[0.95] font-medium text-signal md:text-[2.75rem]">{item.metric}</p>
          <p className="label mt-1 text-white/60">{item.metricLabel}</p>
        </PinnedMark>

        <div className="mt-auto flex items-end justify-between gap-4">
          <p className="label text-white/55">{item.tag}</p>
          <p className="max-w-[220px] text-right font-mono text-[0.75rem] leading-snug text-white/80">{item.client}</p>
        </div>
      </div>
    </li>
  );
}
