"use client";

import { Cpu, Users, Waypoints } from "lucide-react";
import { useEffect, useRef } from "react";
import type { HomeContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";
import { PillLink } from "./links";

const ICONS = [Cpu, Waypoints, Users];
const TONES = ["bg-brand text-white", "bg-signal text-black", "bg-white text-black"];

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

/**
 * Cards arrive in order. Technology is readable on its own, then Expertise
 * rises in front of it, then People. Earlier cards step aside so their text
 * stays visible once the next card takes the front.
 */
export function HowWeWork({ content }: { content: HomeContent["howWeWork"] }) {
  const pin = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
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
      const spread = Math.min(stageEl.offsetWidth * 0.31, 420);
      const segment = span / count;

      if (heading.current) {
        const opacity = desktop ? 1 - clamp((progress - 0.12) / 0.28) : 1;
        heading.current.style.opacity = String(opacity);
        heading.current.style.pointerEvents = opacity < 0.15 ? "none" : "auto";
      }

      for (let i = 0; i < count; i++) {
        const card = cards.current[i];
        if (!card) continue;
        if (!desktop) {
          card.style.transform = "";
          card.style.zIndex = "";
          continue;
        }
        // Card 0 is already in place when the pin starts. Each later card gets the next slice of scroll.
        const enter = clamp((scrolled - segment * (i - 1)) / (segment * 0.9));
        const successor = i < count - 1 ? clamp((scrolled - segment * i) / (segment * 0.9)) : enter;
        const slot = i - (count - 1) / 2;
        // The first card begins centered, then steps left. Later cards rise in their own column so they never cover the one before them.
        const x = slot * spread * (i === 0 ? successor : 1);
        const cardH = card.offsetHeight || stageH * 0.55;
        const y = -cardH * 0.12 + (1 - enter) * stageH * 0.7;
        const tilt = slot * 5 * (i === 0 ? successor : 1);
        card.style.transform = `translate(-50%, ${y.toFixed(2)}px) translateX(${x.toFixed(2)}px) rotate(${tilt.toFixed(2)}deg)`;
        card.style.zIndex = String(enter > 0.04 ? 20 + i : i + 1);
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
    <div ref={pin} className="relative h-auto md:h-[320vh]">
      <div className="md:sticky md:top-0 md:h-svh md:overflow-hidden">
        <div
          ref={heading}
          className="relative z-30 mx-auto flex max-w-3xl flex-col items-center px-5 pt-1 text-center md:absolute md:inset-x-0 md:top-0 md:pt-8"
        >
          <h2 className="text-display">{content.eyebrow}</h2>
          <div className="mt-6">
            <PillLink href={content.ctaHref}>{content.ctaLabel}</PillLink>
          </div>
        </div>

        <div ref={stage} className="relative z-20 mt-8 flex flex-col gap-4 px-5 md:absolute md:inset-0 md:mt-0 md:block md:px-0">
          {content.items.map((item, i) => {
            const Icon = ICONS[i] ?? Cpu;
            return (
              <article
                key={item.label}
                ref={(node) => {
                  cards.current[i] = node;
                }}
                style={{ zIndex: count - i }}
                className={cn(
                  "flex min-h-[280px] flex-col justify-between rounded-lg p-6 shadow-2xl shadow-black/40 md:absolute md:top-[46%] md:left-1/2 md:aspect-[0.72] md:min-h-0 md:w-[min(26vw,21rem)] md:p-8",
                  i === 0 ? "md:[transform:translate(-50%,-12%)]" : "md:[transform:translate(-50%,62vh)]",
                  TONES[i] ?? TONES[0],
                )}
              >
                <Icon className="size-14" strokeWidth={1.15} aria-hidden />
                <div>
                  <p className="label opacity-70">
                    {String(i + 1).padStart(2, "0")} {item.label}
                  </p>
                  <h3 className="text-title mt-3">{item.title}</h3>
                  <p className="text-body mt-4 opacity-80">{item.text}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
