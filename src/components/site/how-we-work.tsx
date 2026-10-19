"use client";

import { Cpu, Users, Waypoints } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HomeContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

const ICONS = [Cpu, Waypoints, Users];
const TONES = ["bg-brand text-white", "bg-signal text-black", "bg-white text-black"];

/** Degrees between neighbouring cards once they have fanned along the arc. */
const SPREAD = 4;

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

/**
 * Portrait cards pinned to the viewport. Each card sits on the top of a huge
 * circle; scrolling rotates that circle a few degrees so the cards fan along
 * an arc and rise, in the manner of Abatable's credentials stack.
 */
export function HowWeWork({ content }: { content: HomeContent["howWeWork"] }) {
  const pin = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const circles = useRef<(HTMLDivElement | null)[]>([]);
  const cards = useRef<(HTMLElement | null)[]>([]);
  const count = content.items.length;

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px) and (prefers-reduced-motion: no-preference)");
    let frame = 0;

    const apply = () => {
      frame = 0;
      const root = pin.current;
      const stageEl = stage.current;
      if (!root || !stageEl) return;
      const desktop = media.matches;
      const span = Math.max(1, root.offsetHeight - window.innerHeight);
      const scrolled = -root.getBoundingClientRect().top;
      const progress = desktop ? clamp(scrolled / span) : 1;
      const stageH = stageEl.offsetHeight || window.innerHeight;

      if (heading.current) {
        const opacity = desktop ? 1 - clamp(progress / 0.25) : 1;
        heading.current.style.opacity = String(opacity);
        heading.current.style.pointerEvents = opacity < 0.15 ? "none" : "auto";
      }
      // The whole ring drifts up slightly across the pin, matching the reference scrub.
      stageEl.style.transform = desktop ? `translateY(${((0.05 - progress * 0.1) * stageH).toFixed(2)}px)` : "";

      const half = ((count - 1) * SPREAD) / 2;
      for (let i = 0; i < count; i++) {
        const dist = span / count;
        const local = desktop ? clamp((scrolled - dist * i) / dist) : 1;
        const angle = (-half + i * SPREAD) * local;
        const card = cards.current[i];
        const circle = circles.current[i];
        const cardH = card?.offsetHeight || stageH * 0.55;
        // The circle's top edge sits halfway down the stage. Keep the stack just under the title, then lift it as it fans.
        const startY = stageH * (0.22 - 0.5);
        const endY = -cardH * 0.55;
        const y = startY + (endY - startY) * local;
        if (circle) circle.style.transform = desktop ? `translateX(-50%) rotate(${angle}deg)` : "";
        if (card) card.style.transform = desktop ? `translate(-50%, ${y.toFixed(2)}px) rotate(${angle}deg)` : "";
      }
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    media.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener("change", schedule);
    };
  }, [count]);

  return (
    <div ref={pin} className="relative h-auto md:h-[400vh]">
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
        <div
          ref={heading}
          className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-5 pt-1 text-center md:absolute md:inset-x-0 md:top-0 md:pt-8"
        >
          <h2 className="display text-4xl md:text-6xl">{content.eyebrow}</h2>
          <div className="mt-6">
            <PillLink href={content.ctaHref}>{content.ctaLabel}</PillLink>
          </div>
        </div>

        <div ref={stage} className="relative z-20 mt-8 flex flex-col gap-4 px-5 md:absolute md:inset-0 md:mt-0 md:block md:px-0">
          {content.items.map((item, i) => {
            const Icon = ICONS[i] ?? Cpu;
            return (
              <div
                key={item.label}
                ref={(node) => {
                  circles.current[i] = node;
                }}
                className="pointer-events-none md:absolute md:top-1/2 md:left-1/2 md:h-[250vw] md:w-[250vw] md:[transform:translateX(-50%)]"
                style={{ zIndex: i + 1 }}
              >
                <article
                  ref={(node) => {
                    cards.current[i] = node;
                  }}
                  className={cn(
                    "pointer-events-auto flex min-h-[280px] flex-col justify-between rounded-lg p-6 shadow-2xl shadow-black/40 md:absolute md:top-0 md:left-1/2 md:aspect-[0.7] md:min-h-0 md:w-[min(25vw,25rem)] md:p-8 md:[transform:translate(-50%,8vh)]",
                    TONES[i] ?? TONES[0],
                  )}
                >
                  <Icon className="size-16" strokeWidth={1.15} aria-hidden />
                  <div>
                    <p className="font-mono text-[11px] tracking-[0.16em] uppercase opacity-70">
                      {String(i + 1).padStart(2, "0")} {item.label}
                    </p>
                    <h3 className="mt-3 font-heading text-[1.7rem] leading-[1.05] font-light md:text-4xl">{item.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed opacity-80">{item.text}</p>
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
