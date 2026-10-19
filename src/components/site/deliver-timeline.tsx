"use client";

import { useLayoutEffect, useRef } from "react";

type Phase = { title: string; text: string };

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

function mix(progress: number, from: number, to: number, start: number, end: number) {
  return start + clamp((progress - from) / Math.max(0.001, to - from)) * (end - start);
}

/** Phases fill from 01 to 04 as the row scrolls through, the way the reference solutions page does. */
export function DeliverTimeline({ phases }: { phases: Phase[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const lineX = root.querySelector<HTMLElement>("[data-line-x]");
    const lineY = root.querySelector<HTMLElement>("[data-line-y]");
    const items = [...root.querySelectorAll<HTMLElement>("[data-phase]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const count = phases.length;

    const paint = () => {
      const full = reduced.matches;
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      const traveled = vh * 0.8 - rect.top;
      const span = Math.max(1, rect.height + vh * 0.25);
      const progress = full ? 1 : clamp(traveled / span);
      if (lineX) lineX.style.transform = `scaleX(${progress})`;
      if (lineY) lineY.style.transform = `scaleY(${progress})`;
      items.forEach((item, index) => {
        const at = count <= 1 ? 1 : index / (count - 1);
        const opacity = mix(progress, at - 0.18, at, 0.25, 1);
        const scale = mix(progress, at - 0.02, at, 0, 1);
        const body = item.querySelector<HTMLElement>("[data-phase-body]");
        const dot = item.querySelector<HTMLElement>("[data-phase-dot]");
        if (body) body.style.opacity = String(opacity);
        if (dot) dot.style.transform = `scale(${scale})`;
      });
    };

    paint();
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
    reduced.addEventListener("change", paint);
    return () => {
      window.removeEventListener("scroll", paint);
      window.removeEventListener("resize", paint);
      reduced.removeEventListener("change", paint);
    };
  }, [phases.length]);

  return (
    <ol ref={ref} className="relative mt-12 grid gap-12 lg:grid-cols-4 lg:gap-x-10">
      <span aria-hidden className="absolute top-0 bottom-0 left-2.5 w-px bg-white/25 lg:top-0 lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      <span aria-hidden data-line-y="" className="absolute top-0 bottom-0 left-2.5 w-px origin-top bg-white lg:hidden" style={{ transform: "scaleY(0)" }} />
      <span aria-hidden data-line-x="" className="absolute top-0 right-0 left-0 hidden h-px origin-left bg-white lg:block" style={{ transform: "scaleX(0)" }} />
      {phases.map((phase, index) => (
        <li key={phase.title} data-phase="" className="relative flex flex-col gap-4 pl-10 lg:pt-12 lg:pl-0">
          <span aria-hidden className="absolute top-1 left-0 grid size-5 place-items-center rounded-full border border-white/40 bg-brand lg:top-0 lg:-translate-y-1/2">
            <span data-phase-dot="" className="size-2.5 rounded-full bg-white" style={{ transform: "scale(0)" }} />
          </span>
          <div data-phase-body="" className="flex flex-col gap-3" style={{ opacity: 0.25 }}>
            <span className="font-heading text-5xl leading-none font-medium tabular-nums">{String(index + 1).padStart(2, "0")}</span>
            <h4 className="text-lg font-medium">{phase.title}</h4>
            <p className="text-body text-white/80">{phase.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
