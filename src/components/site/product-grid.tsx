"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { EnterpriseProductsContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

type Item = EnterpriseProductsContent["products"]["items"][number];

const FALLBACK_COLORS = ["#2a2b30", "#004bff", "#d7c4a3", "#2563FF"];

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

function isLift(product: Item) {
  return product.name.trim().toLowerCase() === "lift" || product.href.replace(/\/$/, "").endsWith("/lift");
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
        const rise = (1 - passed) * 28;
        card.style.opacity = String(0.55 + passed * 0.45);
        card.style.transform = `translateY(${rise}px)`;
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
    <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      <style>{`
        .lift-card, .lift-card .sc-up, .lift-card .sc-down { transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1); }
        .lift-card:hover { transform: translateY(-6px) rotate(-1deg); }
        .lift-card:hover .sc-up { transform: translate(-12px, -8px) rotate(-3deg); }
        .lift-card:hover .sc-down { transform: translate(12px, 8px) rotate(2deg); }
        @media (prefers-reduced-motion: reduce) {
          .lift-card, .lift-card .sc-up, .lift-card .sc-down,
          .lift-card:hover, .lift-card:hover .sc-up, .lift-card:hover .sc-down {
            transform: none !important;
            transition: none !important;
          }
        }
      `}</style>
      {items.map((product, index) => {
        const color = product.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
        const ink = inkFor(color);
        const lift = isLift(product);
        return (
          <div key={product.name} data-product="" className="h-[230px] sm:h-[248px]">
            <Link
              href={product.href}
              className="lift-card flex h-full flex-col justify-between rounded-[20px] px-5 py-6 md:px-7 md:py-7"
              style={{ backgroundColor: color, color: ink }}
            >
              {lift ? (
                <span className="flex h-full flex-col items-center justify-center gap-5">
                  <span className="sc-up block w-[min(220px,78%)]">
                    <CmsImage
                      image={product.logo}
                      file="enterprise-products"
                      path={`products.items.${index}.logo`}
                      fluid
                      className="h-auto w-full"
                      emptyClassName="min-h-16 w-full"
                    />
                  </span>
                  <span className="sc-down inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-medium text-[#2563FF]">
                    Explore LIFT
                  </span>
                </span>
              ) : (
                <>
                  <span className="sc-up flex items-start justify-between gap-6">
                    <h3 className="text-title max-w-[12ch] text-balance">{product.name}</h3>
                    <span className={cn("relative size-9 shrink-0 md:size-11", !product.logo?.src && "hidden [.cms-editing_&]:block")}>
                      <CmsImage
                        image={product.logo}
                        file="enterprise-products"
                        path={`products.items.${index}.logo`}
                        sizes="44px"
                        className="object-contain"
                        emptyClassName="absolute inset-0"
                      />
                    </span>
                  </span>
                  <span className="sc-down flex flex-col gap-3">
                    <span className="border-b border-current/20 pb-2 font-mono text-sm">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-body line-clamp-4 max-w-md">{product.summary || product.tagline}</span>
                  </span>
                </>
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
