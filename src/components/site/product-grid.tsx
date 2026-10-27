"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { EnterpriseProductsContent } from "@/lib/content-types";
import { cn } from "@/lib/utils";

type Item = EnterpriseProductsContent["products"]["items"][number];

const FALLBACK_COLORS = ["#2a2b30", "#991b1b", "#d7c4a3", "#004bff"];

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

function ProductCard({ product, index }: { product: Item; index: number }) {
  const color = product.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  const ink = inkFor(color);
  const lift = isLift(product);

  return (
    <div data-product="" className="h-[268px] sm:h-[286px]">
      <Link
        href={product.href}
        className="product-card relative flex h-full flex-col overflow-hidden rounded-[20px] px-5 py-5 md:px-6 md:py-6"
        style={{ backgroundColor: color, color: ink }}
      >
        {lift ? (
          <span className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <span className="block w-[min(200px,76%)]">
              <CmsImage
                image={product.logo}
                file="enterprise-products"
                path={`products.items.${index}.logo`}
                fluid
                className="h-auto w-full"
                emptyClassName="min-h-14 w-full"
              />
            </span>
            <span className="text-body line-clamp-3">{product.summary || product.tagline}</span>
            <span className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm font-medium text-[#004bff]">
              Explore LIFT
            </span>
          </span>
        ) : (
          <span className="flex h-full flex-col">
            <span className="flex items-start justify-between gap-6">
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
            <span className="mt-auto flex flex-col gap-3">
              <span className="border-b border-current/20 pb-2 font-mono text-sm">{String(index + 1).padStart(2, "0")}</span>
              <span className="text-body line-clamp-4 max-w-md">{product.summary || product.tagline}</span>
            </span>
          </span>
        )}
      </Link>
    </div>
  );
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
      cards.forEach((card) => {
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
        .product-card {
          transition: transform 0.35s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.35s ease;
        }
        .product-card:hover,
        .product-card:focus-visible {
          transform: translateY(-6px);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.22);
        }
        @media (prefers-reduced-motion: reduce) {
          .product-card,
          .product-card:hover,
          .product-card:focus-visible {
            transform: none;
            box-shadow: none;
            transition: none;
          }
        }
      `}</style>
      {items.map((product, index) => (
        <ProductCard key={product.name} product={product} index={index} />
      ))}
    </div>
  );
}
