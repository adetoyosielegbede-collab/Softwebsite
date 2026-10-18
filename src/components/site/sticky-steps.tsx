"use client";

import { useEffect, useRef, useState } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { CmsImage as CmsImageValue } from "@/lib/cms/paths";
import { cn } from "@/lib/utils";

type Step = { label: string; title: string; text: string; image: CmsImageValue };

export function StickySteps({ steps, file, path }: { steps: Step[]; file: string; path: string }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [steps.length]);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:gap-16">
      <ol>
        {steps.map((step, i) => (
          <li
            key={step.title}
            ref={(el) => {
              refs.current[i] = el;
            }}
            data-index={i}
            className="flex flex-col justify-center py-10 lg:min-h-[70vh] lg:py-0"
          >
            <p className="font-mono text-[11px] tracking-[0.14em] text-ink-faint uppercase">
              {String(i + 1).padStart(2, "0")} — {step.label}
            </p>
            <h3 className={cn("display mt-3 text-3xl transition-colors duration-500", i === active ? "text-ink" : "lg:text-ink-faint")}>
              {step.title}
            </h3>
            <p className={cn("mt-3 max-w-sm text-[13px] leading-relaxed transition-colors duration-500", i === active ? "text-ink-soft" : "lg:text-ink-faint")}>
              {step.text}
            </p>
            <div className="relative mt-6 aspect-[719/520] overflow-hidden rounded-3xl bg-night lg:hidden">
              <CmsImage image={step.image} file={file} path={`${path}.${i}.image`} sizes="100vw" emptyClassName="absolute inset-0" />
            </div>
          </li>
        ))}
      </ol>
      <div className="hidden lg:block">
        <div className="sticky top-[15vh] aspect-[719/520] overflow-hidden rounded-3xl bg-night">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className={cn("absolute inset-0 transition-opacity duration-700", i === active ? "opacity-100" : "pointer-events-none opacity-0")}
            >
              <CmsImage image={step.image} file={file} path={`${path}.${i}.image`} sizes="55vw" emptyClassName="absolute inset-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
