"use client";

import { useEffect, useRef } from "react";
import { bayer8, BLUE, CELL, coverage, CYAN, field, FRONT } from "./dither-math";

type Dot = { x: number; y: number; threshold: number; field: number; density: number; color: string };
type Spark = { x: number; y: number; threshold: number; tube: number; along: number };

/**
 * The two-disc conduit behind the homepage headline. Cells fill in, then a
 * cyan pulse travels along the tube between them.
 */
export function ConduitCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dots: Dot[] = [];
    let sparks: Spark[] = [];
    let span: { from: number; to: number }[] = [];
    let cell = CELL;
    let reach = 1;
    let raf = 0;
    let settled = false;
    const copy = canvas.closest("section")?.querySelector("[data-hero-copy]");

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      cell = CELL * dpr;
      const cols = Math.ceil(width / CELL);
      const rows = Math.ceil(height / CELL);
      const narrow = width < 768;
      const copyTop = copy?.getBoundingClientRect().top;
      const canvasTop = canvas.getBoundingClientRect().top;
      const stage = copyTop
        ? Math.max(160, Math.min(height, (copyTop - canvasTop - 32) / 0.6))
        : height;
      const cy = stage * (narrow ? 0.32 : 0.38);
      const radius = Math.max(40, Math.min(width * (narrow ? 0.15 : 0.11), 0.16 * stage, 180));
      const spread = Math.min(width * (narrow ? 0.3 : 0.28), 3.2 * radius);
      const discs = [
        { x: width / 2 - spread, y: cy, r: radius },
        { x: width / 2 + spread, y: cy, r: radius },
      ];
      const dx = discs[1].x - discs[0].x;
      const dy = discs[1].y - discs[0].y;
      const length = Math.hypot(dx, dy);
      const tube = {
        ax: discs[0].x,
        ay: discs[0].y,
        dx,
        dy,
        length,
        half: 0.4 * radius,
      };
      span = [{ from: discs[0].r, to: length - discs[1].r }];
      reach = 1.1 * tube.half;
      const minX = Math.min(...discs.map((d) => d.x - d.r));
      const maxX = Math.max(...discs.map((d) => d.x + d.r));
      dots = [];
      sparks = [];

      for (let row = 0; row < rows; row++) {
        const y = (row + 0.5) * CELL;
        const fromTop = rows - 1 - row;
        for (let col = 0; col < cols; col++) {
          const x = (col + 0.5) * CELL;
          let outside = Infinity;
          let discR = 0;
          for (const disc of discs) {
            const dist = Math.hypot(x - disc.x, y - disc.y) - disc.r;
            if (dist < outside) {
              outside = dist;
              discR = disc.r;
            }
          }
          let density = 0;
          if (outside < 0) {
            const depth = -outside / discR;
            density = depth > 0.2 ? 1 : 0.4 + (depth / 0.2) * 0.6;
          }
          let tubeIndex = -1;
          let along = 0;
          const t = ((x - tube.ax) * tube.dx + (y - tube.ay) * tube.dy) / (tube.length * tube.length);
          if (t > 0 && t < 1) {
            const px = tube.ax + t * tube.dx;
            const py = tube.ay + t * tube.dy;
            const dist = Math.hypot(x - px, y - py);
            if (dist < tube.half) {
              density = Math.max(density, 0.6 * Math.sqrt(1 - dist / tube.half));
              tubeIndex = 0;
              along = t * tube.length;
            }
          }
          let color = "#2e2e2e";
          if (density > 0) {
            const mix = (x - minX) / Math.max(1, maxX - minX);
            color = bayer8(col + 3, fromTop + 5) < mix ? CYAN : BLUE;
          } else if (outside < 1.3 * reach) {
            density = 0.16 * (1 - outside / (1.3 * reach));
          }
          if (density <= 0) continue;
          const dot = {
            x: col * cell,
            y: row * cell,
            threshold: bayer8(col, fromTop),
            field: field(col, fromTop, fromTop / Math.max(1, rows - 1), 3),
            density,
            color,
          };
          dots.push(dot);
          if (tubeIndex >= 0 && outside >= 0) sparks.push({ x: dot.x, y: dot.y, threshold: dot.threshold, tube: tubeIndex, along });
        }
      }
    };

    const paint = (progress: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const s = cell * 0.92;
      for (const dot of dots) {
        const amount = progress >= 1 ? 1 : coverage(progress, dot.field);
        if (dot.threshold >= dot.density * amount) continue;
        ctx.fillStyle = amount < FRONT ? CYAN : dot.color;
        ctx.fillRect(dot.x, dot.y, s, s);
      }
    };

    const pulse = (time: number) => {
      paint(1);
      const waves = span.map((band, index) => {
        const travel = band.to - band.from;
        return [0, 1, 2].map((step) => band.from + (((time / 3.2 + step / 3 + 0.37 * index) % 1) * travel));
      });
      ctx.fillStyle = CYAN;
      const s = cell * 0.92;
      for (const spark of sparks) {
        let glow = 0;
        for (const center of waves[spark.tube] ?? []) {
          const d = (spark.along - center) / reach;
          glow = Math.max(glow, Math.exp(-d * d));
        }
        if (spark.threshold < 0.9 * glow) ctx.fillRect(spark.x, spark.y, s, s);
      }
    };

    layout();
    const started = performance.now();
    const frame = (now: number) => {
      const elapsed = now - started;
      if (!settled && elapsed < 1600) paint(1 - (1 - elapsed / 1600) ** 3);
      else {
        if (!settled) {
          paint(1);
          settled = true;
        }
        if (reduced) return;
        pulse((elapsed - 1600) / 1000);
      }
      raf = requestAnimationFrame(frame);
    };

    if (reduced) paint(1);
    else raf = requestAnimationFrame(frame);

    const observer = new ResizeObserver(() => {
      layout();
      if (reduced || settled) paint(1);
    });
    observer.observe(canvas);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="block size-full" />;
}
