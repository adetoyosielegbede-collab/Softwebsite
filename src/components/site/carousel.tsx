"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/** Horizontal scroll-snap rail with previous/next controls. Children should be snap items. */
export function Carousel({
  children,
  label,
  className,
  controlsClassName,
}: {
  children: React.ReactNode;
  label: string;
  className?: string;
  controlsClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(":scope > *");
    el.scrollBy({ left: dir * ((item?.offsetWidth ?? el.clientWidth * 0.8) + 16), behavior: "smooth" });
  };

  return (
    <div className={className}>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 sm:px-8 lg:px-10"
      >
        {children}
        <div aria-hidden className="w-px shrink-0" />
      </div>
      <div className={cn("container-site mt-6 flex justify-end gap-2", controlsClassName)}>
        {([-1, 1] as const).map((dir) => (
          <button
            key={dir}
            type="button"
            onClick={() => scroll(dir)}
            disabled={dir === -1 ? edges.start : edges.end}
            aria-label={dir === -1 ? "Previous" : "Next"}
            className="grid size-10 place-items-center rounded-full border border-line-strong text-ink transition-colors hover:bg-ink hover:text-paper disabled:pointer-events-none disabled:opacity-30"
          >
            {dir === -1 ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
          </button>
        ))}
      </div>
    </div>
  );
}
