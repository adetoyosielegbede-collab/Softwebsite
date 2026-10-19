"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/** Fades and lifts hero copy as the next section scrolls up over an interior page. */
export function HeroMotion({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    const section = node?.closest("section");
    if (!node || !section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const travel = Math.max(rect.height * 0.7, 1);
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      node.style.transform = `translate3d(0, ${(-32 * progress).toFixed(1)}px, 0)`;
      node.style.opacity = (1 - progress * 0.7).toFixed(3);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
