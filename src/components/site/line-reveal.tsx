"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const EASE = "cubic-bezier(.16, 1, .3, 1)";

/** A heading that rises one wrapped line at a time when it enters view. */
export function LineReveal({
  as: Tag = "h2",
  className,
  children,
  delay = 0,
}: {
  as?: "h1" | "h2" | "h3" | "p";
  className?: string;
  children: string;
  delay?: number;
}) {
  const ref = useRef<HTMLHeadingElement | HTMLParagraphElement>(null);
  const [lines, setLines] = useState<string[] | null>(null);
  const [shown, setShown] = useState(false);
  const words = children.split(/\s+/);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const measure = () => {
      const nodes = [...el.querySelectorAll<HTMLElement>("[data-word]")];
      const grouped: string[][] = [];
      let top: number | null = null;
      for (const node of nodes) {
        if (node.offsetTop !== top) {
          grouped.push([]);
          top = node.offsetTop;
        }
        grouped[grouped.length - 1].push(node.textContent ?? "");
      }
      setLines(grouped.map((line) => line.join(" ")));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [children]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !lines) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lines]);

  return (
    <Tag ref={ref} className={className}>
      {!lines ? (
        words.map((word, index) => (
          <span key={`${word}-${index}`}>
            <span data-word="">{word}</span>
            {index < words.length - 1 ? " " : null}
          </span>
        ))
      ) : (
        <>
          <span className="sr-only">{children}</span>
          {lines.map((line, index) => (
            <span key={`${index}-${line}`} aria-hidden className="block overflow-hidden pb-[0.12em]">
              <span
                className={cn("block", shown && "line-revealed")}
                style={{
                  transform: shown ? undefined : "translateY(110%)",
                  animation: shown ? `line-rise .9s ${EASE} ${delay + index * 80}ms both` : undefined,
                }}
              >
                {line}
              </span>
            </span>
          ))}
        </>
      )}
    </Tag>
  );
}
