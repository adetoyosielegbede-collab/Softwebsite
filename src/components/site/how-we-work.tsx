"use client";

import { useEffect, useRef, useState } from "react";
import type { HomeContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

function Steps({ content, active }: { content: HomeContent["howWeWork"]; active: number }) {
  return (
    <ol className="border-t border-line">
      {content.items.map((item, i) => (
        <li key={item.label} className="relative border-b border-line py-4">
          <span
            aria-hidden
            className={cn(
              "absolute top-0 left-0 h-px origin-left bg-signal transition-transform duration-700 ease-[cubic-bezier(.16,1.08,.38,.98)]",
              i <= active ? "scale-x-100" : "scale-x-0",
            )}
            style={{ width: "100%" }}
          />
          <span className={cn("flex items-baseline gap-4 transition-colors duration-500", i === active ? "text-ink" : "text-ink-faint")}>
            <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-heading text-2xl font-light">{item.label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

function Copy({ item }: { item: HomeContent["howWeWork"]["items"][number] }) {
  return (
    <div key={item.label} className="rise-in">
      <h3 className="display text-4xl leading-tight lg:text-5xl">{item.title}</h3>
      <p className="mt-6 max-w-xl text-sm leading-relaxed text-ink-soft lg:text-base">{item.text}</p>
    </div>
  );
}

/** Desktop: the step changes as this block is scrolled. Smaller screens list every step. */
export function HowWeWork({ content }: { content: HomeContent["howWeWork"] }) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const count = content.items.length;
  const item = content.items[active] ?? content.items[0];

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = track.current;
      if (!el || !media.matches || count === 0) return;
      const span = el.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(0.999, -el.getBoundingClientRect().top / Math.max(1, span)));
      setActive(Math.min(count - 1, Math.floor(progress * count)));
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [count]);

  if (!item) return null;

  return (
    <>
      <div ref={track} className="relative hidden lg:motion-safe:block" style={{ height: `${80 * count + 20}svh` }}>
        <div className="sticky top-[10svh] flex h-[80svh] items-center">
          <div className="grid w-full grid-cols-12 gap-x-6">
            <div className="col-span-4 flex flex-col gap-8">
              <p className="eyebrow">{content.eyebrow}</p>
              <Steps content={content} active={active} />
            </div>
            <div className="col-span-7 col-start-6">
              <Copy item={item} />
              <div className="mt-10">
                <PillLink href={content.ctaHref}>{content.ctaLabel}</PillLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:motion-safe:hidden">
        <p className="eyebrow mb-6">{content.eyebrow}</p>
        <ol className="flex flex-col">
          {content.items.map((step, i) => (
            <li key={step.label} className="grid gap-4 border-t border-line py-10 last:border-b lg:grid-cols-12">
              <p className="flex items-baseline gap-4 text-ink lg:col-span-4">
                <span className="font-mono text-[11px] tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-heading text-2xl font-light">{step.label}</span>
              </p>
              <div className="lg:col-span-7 lg:col-start-6">
                <h3 className="display text-3xl leading-tight">{step.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-8">
          <PillLink href={content.ctaHref}>{content.ctaLabel}</PillLink>
        </div>
      </div>
    </>
  );
}
