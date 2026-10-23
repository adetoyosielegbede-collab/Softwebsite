"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

/**
 * Words start grey and fill to the ink colour as the block scrolls through.
 * Matches the solutions intro on the reference site: opacity 0.16 → 1.
 */
export function ScrollWords({
  paragraphs,
  className,
  paragraphClassName,
  paragraphStyle,
}: {
  paragraphs: string[];
  className?: string;
  paragraphClassName?: string;
  paragraphStyle?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const words = [...root.querySelectorAll<HTMLElement>("[data-word]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const paint = () => {
      if (reduced.matches) {
        for (const word of words) word.style.opacity = "1";
        return;
      }
      const rect = root.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the block's top hits 85% of the viewport, 1 when its bottom hits 45%.
      const traveled = vh * 0.85 - rect.top;
      const span = Math.max(1, rect.height + vh * 0.4);
      const progress = clamp(traveled / span);
      const count = words.length;
      words.forEach((word, index) => {
        const start = index / count;
        const end = Math.min(1, (index + 1.5) / count);
        const local = clamp((progress - start) / Math.max(0.001, end - start));
        word.style.opacity = String(0.16 + local * 0.84);
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
  }, [paragraphs]);

  return (
    <div ref={ref} className={cn("flex flex-col gap-8", className)}>
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className={cn("text-ink", paragraphClassName ?? "text-title")} style={paragraphStyle}>
          {paragraph.split(" ").map((word, index, all) => (
            <span key={`${word}-${index}`} data-word="" style={{ opacity: 0.16 }}>
              {word}
              {index < all.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      ))}
    </div>
  );
}
