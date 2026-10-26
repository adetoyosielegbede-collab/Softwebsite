"use client";

import { type RefObject, useEffect, useState } from "react";

const TOUCH_LAYOUT = "(max-width: 1023.98px)";

/**
 * For a row that scrolls sideways on small screens: nudges the row once when it first comes
 * into view, and reports whether the visitor has swiped it yet.
 */
export function useSwipeHint(row: RefObject<HTMLElement | null>) {
  const [swiped, setSwiped] = useState(false);

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const layout = window.matchMedia(TOUCH_LAYOUT);
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer = 0;
    let done = false;

    const onScroll = () => {
      if (el.scrollLeft > 24) setSwiped(true);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || done || !layout.matches || still.matches || el.scrollLeft > 24) return;
        done = true;
        timer = window.setTimeout(() => {
          el.classList.add("swipe-hint");
          timer = window.setTimeout(() => el.classList.remove("swipe-hint"), 1600);
        }, 350);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      el.classList.remove("swipe-hint");
    };
  }, [row]);

  return swiped;
}

/** Gives every element matching `selector` inside the row the height of the tallest one. */
export function useEqualHeights(row: RefObject<HTMLElement | null>, selector: string) {
  useEffect(() => {
    const el = row.current;
    if (!el) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const items = [...el.querySelectorAll<HTMLElement>(selector)];
        for (const item of items) item.style.minHeight = "";
        const tallest = Math.max(0, ...items.map((item) => item.offsetHeight));
        for (const item of items) item.style.minHeight = `${tallest}px`;
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.fonts?.ready.then(measure);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [row, selector]);
}
