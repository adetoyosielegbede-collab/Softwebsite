"use client";

import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { EnterpriseProductsContent } from "@/lib/content-types";

type Item = EnterpriseProductsContent["products"]["items"][number];

const FALLBACK_COLORS = ["#2a2b30", "#991b1b", "#ffffff", "#004bff"];

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

function exploreLabel(product: Item) {
  if (product.name.trim().toLowerCase() === "lift" || product.href.replace(/\/$/, "").endsWith("/lift")) {
    return "Explore LIFT";
  }
  return `Explore ${product.name}`;
}

function ProductCard({ product, index }: { product: Item; index: number }) {
  const color = product.color || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
  const ink = inkFor(color);
  const lightCard = ink === "#0c0c0d";
  const hasLogo = Boolean(product.logo?.src);

  return (
    <div data-product="" className="h-[268px] sm:h-[286px]">
      <Link
        href={product.href}
        className="product-card relative flex h-full flex-col overflow-hidden rounded-[20px] px-5 py-5 md:px-6 md:py-6"
        style={{ backgroundColor: color, color: ink }}
      >
        <span className="flex h-full w-full flex-col items-center text-center">
          <span className="flex w-full flex-1 flex-col items-center justify-center gap-4">
            <span className="flex h-24 w-[min(230px,84%)] items-center justify-center">
              {hasLogo ? (
                <CmsImage
                  image={product.logo}
                  file="enterprise-products"
                  path={`products.items.${index}.logo`}
                  fluid
                  className="h-auto w-auto max-h-full max-w-full object-contain"
                  emptyClassName="min-h-12 w-full"
                />
              ) : (
                <>
                  <h3 className="text-title text-balance">{product.name}</h3>
                  <CmsImage
                    image={product.logo}
                    file="enterprise-products"
                    path={`products.items.${index}.logo`}
                    fluid
                    emptyClassName="mt-3 min-h-12 w-full"
                  />
                </>
              )}
            </span>
            <span className="line-clamp-3 max-w-[32ch] text-[12px] leading-[1.35] md:text-sm">{product.summary || product.tagline}</span>
          </span>
          <span
            className="mt-4 inline-flex h-10 w-40 shrink-0 items-center justify-center rounded-full px-4 text-sm font-medium"
            style={lightCard ? { backgroundColor: "#0c0c0d", color: "#ffffff" } : { backgroundColor: "#ffffff", color }}
          >
            {exploreLabel(product)}
          </span>
        </span>
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
        const passed = clamp((vh * 1.2 - center) / (vh * 0.22));
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
