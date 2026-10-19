"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number, t: number) => void;

function useCanvasLoop(draw: Draw, fps = 30) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h, (performance.now() - start) / 1000);
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible || now - last < 1000 / fps) return;
      last = now;
      draw(ctx, w, h, (now - start) / 1000);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(canvas);
    resize();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [draw, fps]);

  return ref;
}

function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5].map((v) => (v + 0.5) / 16);
const bayer = (i: number, j: number) => BAYER[(j & 3) * 4 + (i & 3)];

const drawStarField: Draw = (ctx, w, h, t) => {
  ctx.clearRect(0, 0, w, h);
  const gap = 26;
  for (let y = gap / 2; y < h; y += gap) {
    for (let x = gap / 2; x < w; x += gap) {
      const r = hash(x, y);
      if (r > 0.42) continue;
      const tw = 0.5 + 0.5 * Math.sin(t * (0.6 + r * 1.6) + r * 40);
      const signal = r < 0.02;
      const alpha = signal ? 0.35 + 0.5 * tw : 0.06 + 0.22 * tw * (r < 0.15 ? 1 : 0.5);
      const light = document.documentElement.classList.contains("light");
      ctx.fillStyle = signal ? `rgba(0,255,255,${alpha})` : light ? `rgba(12,12,13,${alpha})` : `rgba(255,255,255,${alpha})`;
      const s = signal ? 2 : 1.4;
      ctx.fillRect(x + (r - 0.2) * 8, y + (hash(y, x) - 0.5) * 8, s, s);
    }
  }
  const light = document.documentElement.classList.contains("light");
  const fade = ctx.createLinearGradient(0, h * 0.55, 0, h);
  const paper = light ? "246,245,241" : "10,10,10";
  fade.addColorStop(0, `rgba(${paper},0)`);
  fade.addColorStop(1, `rgba(${paper},1)`);
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
};

const drawHeroMatrix: Draw = (ctx, w, h, t) => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  const cell = w < 640 ? 6 : 8;
  const size = cell * 0.62;
  const cy = h * (w < 640 ? 0.32 : 0.34);
  const r = Math.min(w * 0.11, h * 0.2) * (1 + 0.025 * Math.sin(t * 1.2));
  const ax = w * 0.22;
  const bx = w * 0.78;

  for (let j = 0, y = cell / 2; y < h; j++, y += cell) {
    for (let i = 0, x = cell / 2; x < w; i++, x += cell) {
      const da = Math.hypot(x - ax, y - cy);
      const db = Math.hypot(x - bx, y - cy);
      const threshold = bayer(i, j);

      if (da < r || db < r) {
        const inA = da < r;
        const d = (inA ? da : db) / r;
        const shimmer = 0.08 * Math.sin(t * 2 + i * 0.35 + j * 0.2);
        const v = 0.95 - d * d * 0.55 + shimmer;
        if (v > threshold) {
          ctx.fillStyle = inA ? (v > 0.75 ? "#1a5cff" : "#004bff") : v > 0.75 ? "#5ff" : "#0ff";
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        } else if (inA) {
          ctx.fillStyle = "rgba(0,255,255,0.65)";
          ctx.fillRect(x - size / 4, y - size / 4, size / 2, size / 2);
        } else {
          ctx.fillStyle = "rgba(0,75,255,0.8)";
          ctx.fillRect(x - size / 4, y - size / 4, size / 2, size / 2);
        }
        continue;
      }

      const band = r * 0.42;
      if (x > ax + r * 0.6 && x < bx - r * 0.6 && Math.abs(y - cy) < band) {
        const flow = 0.5 + 0.5 * Math.sin(x * 0.045 - t * 2.4) * Math.cos(y * 0.09 + t * 0.7);
        const edge = 1 - Math.abs(y - cy) / band;
        const v = flow * 0.75 + edge * 0.35;
        if (v > threshold) {
          ctx.fillStyle = v > 0.85 ? "#bff" : "#0ff";
          ctx.fillRect(x - size / 2, y - size / 2, size, size);
        } else if (v > threshold * 0.6) {
          ctx.fillStyle = "rgba(0,255,255,0.35)";
          ctx.fillRect(x - size / 4, y - size / 4, size / 2, size / 2);
        }
        continue;
      }

      const halo = Math.min(da, db) / r;
      if (halo < 3.2) {
        const p = (1 - (halo - 1) / 2.2) * 0.9;
        const n = hash(i, j);
        if (n < p) {
          const tw = 0.5 + 0.5 * Math.sin(t * 1.5 + n * 30);
          ctx.fillStyle = `rgba(255,255,255,${0.08 + 0.22 * tw * p})`;
          const s = size * 0.4;
          ctx.fillRect(x - s / 2, y - s / 2, s, s);
        }
      }
    }
  }
};

const MASKS = {
  hero: "radial-gradient(ellipse 70% 80% at 50% 45%, rgb(0 0 0 / 0.25) 0%, #000 40%, #000 50%, transparent 85%)",
  page: "radial-gradient(ellipse 130% 90% at 16% 22%, rgb(0 0 0 / 0.4) 0%, #000 32%, #000 68%, transparent 96%)",
} as const;

type Bit = {
  x: number;
  y: number;
  size: number;
  period: number;
  offset: number;
  one: boolean;
  accent: boolean;
  cycle: number;
};

/** Faint 0s and 1s. `hero` sits behind a page title; `page` spreads across a whole section. */
export function HeroBits({ className, presence = "hero" }: { className?: string; presence?: keyof typeof MASKS }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const probe = document.createElement("span");
    probe.style.display = "none";
    canvas.parentElement?.appendChild(probe);
    const read = (name: string) => {
      probe.style.color = `var(${name})`;
      return getComputedStyle(probe).color;
    };
    const palette = () => {
      probe.style.fontFamily = "var(--font-mono)";
      return { ink: read("--color-ink"), accent: read("--color-accent-ink"), mono: getComputedStyle(probe).fontFamily };
    };

    let colors = palette();
    let w = 0;
    let h = 0;
    let bits: Bit[] = [];
    let raf = 0;
    let frame = 0;
    let visible = true;

    const draw = (time: number) => {
      const t = time / 1000;
      ctx.clearRect(0, 0, w, h);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (const bit of bits) {
        const phase = t / bit.period + bit.offset;
        const cycle = Math.floor(phase);
        if (cycle !== bit.cycle) {
          if (bit.cycle !== -1 && Math.random() < 0.5) bit.one = !bit.one;
          bit.cycle = cycle;
        }
        const glow = Math.max(0, Math.sin((phase - cycle) * Math.PI)) ** 3;
        if (glow < 0.02) continue;
        const inkAlpha = presence === "page" ? 0.34 : 0.2;
        const accentAlpha = presence === "page" ? 0.62 : 0.45;
        ctx.globalAlpha = glow * (bit.accent ? accentAlpha : inkAlpha);
        ctx.fillStyle = bit.accent ? colors.accent : colors.ink;
        ctx.font = `400 ${bit.size}px ${colors.mono}`;
        ctx.fillText(bit.one ? "1" : "0", bit.x, bit.y);
      }
      ctx.globalAlpha = 1;
    };

    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.max(12, Math.round((w * h) / (presence === "page" ? 1500 : 2400)));
      bits = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 9 + 6 * Math.random(),
        period: 4 + 7 * Math.random(),
        offset: Math.random(),
        one: Math.random() > 0.5,
        accent: Math.random() < 0.04,
        cycle: -1,
      }));
      draw(reduced ? 5000 : performance.now());
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      frame += 1;
      if (frame % 2 || !visible || document.hidden) return;
      draw(time);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      colors = palette();
      if (reduced) draw(5000);
    });
    mo.observe(document.documentElement, { attributeFilter: ["class"] });
    layout();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      probe.remove();
    };
  }, [presence]);

  const mask = MASKS[presence];
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

type Cross = { x: number; y: number; size: number; alpha: number };

/** Sparse registration crosses, the same marks that sit on the homepage sections. */
export function CrossField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const probe = document.createElement("span");
    probe.style.display = "none";
    canvas.parentElement?.appendChild(probe);
    const read = () => {
      probe.style.color = "var(--color-ink)";
      return getComputedStyle(probe).color;
    };

    let ink = read();
    let w = 0;
    let h = 0;
    let marks: Cross[] = [];
    let raf = 0;
    let frame = 0;
    let visible = true;

    const draw = (time: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      const t = time / 1000;
      for (const mark of marks) {
        const pulse = reduced ? 1 : 0.72 + 0.28 * Math.sin(t * 0.6 + mark.x * 0.01);
        ctx.globalAlpha = mark.alpha * pulse;
        const arm = mark.size / 2;
        ctx.beginPath();
        ctx.moveTo(mark.x - arm, mark.y);
        ctx.lineTo(mark.x + arm, mark.y);
        ctx.moveTo(mark.x, mark.y - arm);
        ctx.lineTo(mark.x, mark.y + arm);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    };

    const layout = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 72 : 96;
      marks = [];
      for (let y = gap / 2; y < h; y += gap) {
        for (let x = gap / 2; x < w; x += gap) {
          const n = hash(x, y);
          if (n > 0.62) continue;
          marks.push({ x, y, size: 8 + (n > 0.4 ? 6 : 0), alpha: 0.1 + n * 0.16 });
        }
      }
      draw(reduced ? 0 : performance.now());
    };

    const loop = (time: number) => {
      raf = requestAnimationFrame(loop);
      frame += 1;
      if (frame % 2 || !visible || document.hidden) return;
      draw(time);
    };

    const ro = new ResizeObserver(layout);
    ro.observe(canvas);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
    });
    io.observe(canvas);
    const mo = new MutationObserver(() => {
      ink = read();
      draw(reduced ? 0 : performance.now());
    });
    mo.observe(document.documentElement, { attributeFilter: ["class"] });
    layout();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      probe.remove();
    };
  }, []);

  const mask = "radial-gradient(ellipse 120% 80% at 18% 20%, rgb(0 0 0 / 0.35) 0%, #000 28%, #000 70%, transparent 96%)";
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}

export function StarField({ className }: { className?: string }) {
  const ref = useCanvasLoop(drawStarField, 24);
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}

export function HeroMatrix({ className }: { className?: string }) {
  const ref = useCanvasLoop(drawHeroMatrix, 30);
  return <canvas ref={ref} aria-hidden className={cn("pointer-events-none absolute inset-0 size-full", className)} />;
}
