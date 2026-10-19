"use client";

import { useEffect, useRef, useState } from "react";

function parts(value: string) {
  const match = value.match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) return null;
  const [, prefix, raw, suffix] = match;
  const decimals = raw.includes(".") ? (raw.split(".")[1]?.length ?? 0) : 0;
  const number = Number(raw.replace(/,/g, ""));
  if (!Number.isFinite(number)) return null;
  return { prefix, suffix, number, decimals };
}

function format(n: number, decimals: number) {
  return decimals === 0 ? String(Math.round(n)) : n.toFixed(decimals);
}

/** Counts a figure up from zero once it scrolls into view. */
export function CountUp({ value, delay = 0 }: { value: string; delay?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const parsed = parts(value);
    if (!el || !parsed || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let timer = 0;
    let started = false;
    const { prefix, suffix, number, decimals } = parsed;

    const run = () => {
      const duration = 1500;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - (1 - t) ** 3;
        setText(`${prefix}${format(number * eased, decimals)}${suffix}`);
        if (t < 1) frame = requestAnimationFrame(tick);
      };
      setText(`${prefix}${format(0, decimals)}${suffix}`);
      frame = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        observer.disconnect();
        setText(`${prefix}${format(0, decimals)}${suffix}`);
        timer = window.setTimeout(run, delay);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.clearTimeout(timer);
    };
  }, [value, delay]);

  return (
    <span ref={ref} className="inline-grid">
      <span className="sr-only">{value}</span>
      <span aria-hidden className="invisible col-start-1 row-start-1">
        {value}
      </span>
      <span aria-hidden className="col-start-1 row-start-1 tabular-nums">
        {text}
      </span>
    </span>
  );
}
