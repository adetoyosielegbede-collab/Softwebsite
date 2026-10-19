"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { EnterpriseProductsContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

type Item = EnterpriseProductsContent["products"]["items"][number];

const FALLBACK_COLORS = ["#2a2b30", "#004bff", "#d7c4a3", "#1f6a5c"];

function inkFor(color: string) {
  const hex = color.trim().replace("#", "");
  const full = hex.length === 3 ? hex.split("").map((c) => c + c).join("") : hex;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return "#f6f5f1";
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.62 ? "#0c0c0d" : "#f6f5f1";
}

function clamp(n: number) {
  return Math.max(0, Math.min(1, n));
}

export function ProductGrid({ items }: { items: Item[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const cards = [...root.querySelectorAll<HTMLElement>("[data-product]")];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const paint = () => {
      frame = 0;
      const vh = window.innerHeight;
      cards.forEach((card, index) => {
        if (reduced.matches) {
          card.style.transform = "";
          card.style.opacity = "1";
          return;
        }
        const rect = card.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const passed = clamp((vh * 0.72 - center) / (vh * 0.55) + 0.5);
        const columnLag = index % 2 === 1 ? 0.08 : 0;
        const rise = (1 - passed) * (36 + columnLag * 80);
        const scale = 0.94 + passed * 0.06;
        card.style.opacity = String(0.45 + passed * 0.55);
        card.style.transform = `translateY(${rise}px) scale(${scale})`;
      });
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, [items.length]);

  return (
    <div ref={ref} className="grid gap-4 md:grid-cols-2 md:gap-5">
      {items.map((product, index) => {
        const color = product.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
        const ink = inkFor(color);
        return (
          <Link
            key={product.name}
            href={product.href}
            data-product=""
            className={cn(
              "group flex min-h-[200px] flex-col justify-between gap-8 rounded-[20px] px-5 py-7 md:min-h-[280px] md:px-8 md:py-8",
              index % 2 === 1 && "md:mt-10",
            )}
            style={{ backgroundColor: color, color: ink }}
          >
            <div className="flex items-start justify-between gap-6">
              <h3 className="text-title max-w-[12ch] text-balance">{product.name}</h3>
              <div className={cn("relative size-9 shrink-0 md:size-12", !product.logo?.src && "hidden [.cms-editing_&]:block")}>
                <CmsImage
                  image={product.logo}
                  file="enterprise-products"
                  path={`products.items.${index}.logo`}
                  sizes="48px"
                  className="object-contain"
                  emptyClassName="absolute inset-0"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="border-b border-current/20 pb-2 font-mono text-sm">{String(index + 1).padStart(2, "0")}</p>
              <p className="text-body max-w-md">{product.summary || product.tagline}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
