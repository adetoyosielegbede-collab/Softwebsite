"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { smoothstep } from "./dither-math";

const watching = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function paint() {
  frame = 0;
  const height = window.innerHeight;
  for (const el of watching) {
    const amount = Math.max(0, Math.min(1, (0.95 - el.getBoundingClientRect().top / height) / 0.6));
    el.style.setProperty("--reveal", smoothstep(amount).toFixed(3));
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(paint);
}

function stop() {
  if (watching.size) return;
  listening = false;
  cancelAnimationFrame(frame);
  frame = 0;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
}

/** Photos arrive in greyscale and take on colour as they enter the viewport. */
export function ColorReveal({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.style.setProperty("--reveal", "0");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          watching.add(el);
          if (!listening) {
            listening = true;
            window.addEventListener("scroll", schedule, { passive: true });
            window.addEventListener("resize", schedule);
          }
          schedule();
        } else {
          watching.delete(el);
          stop();
        }
      },
      { rootMargin: "20% 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      watching.delete(el);
      stop();
    };
  }, []);

  return (
    <div ref={ref} className={cn("softcom-color-reveal", className)}>
      {children}
    </div>
  );
}
