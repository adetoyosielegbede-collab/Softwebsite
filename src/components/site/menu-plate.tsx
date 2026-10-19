"use client";

import { useEffect, useRef } from "react";
import { bayer8, BLUE, CELL, cellState, CYAN, field, glyphAt, GLYPH_MIN } from "./dither-math";

/** The pixel field on the left of a desktop dropdown. The pointer opens it up. */
export function MenuPlate({ seed = 3, className = "" }: { seed?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    const root = canvas?.closest("[data-nav-plate-root]");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = canvas.clientWidth || canvas.parentElement?.clientWidth || 176;
    const height = canvas.clientHeight || canvas.parentElement?.clientHeight || 208;
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    const cell = CELL * dpr;
    const cols = Math.ceil(canvas.width / cell);
    const rows = Math.ceil(canvas.height / cell);
    const dots: { col: number; row: number; threshold: number; field: number }[] = [];
    for (let row = 0; row < rows; row++) {
      const fromTop = rows - 1 - row;
      for (let col = 0; col < cols; col++) {
        dots.push({
          col,
          row,
          threshold: bayer8(col, fromTop),
          field: field(col, fromTop, fromTop / Math.max(1, rows - 1), seed),
        });
      }
    }

    const pointer = { x: cols * 0.62, y: rows / 2, on: 0 };
    const cursor = { ...pointer };
    const onMove = (event: Event) => {
      if (!(event instanceof PointerEvent)) return;
      const box = canvas.getBoundingClientRect();
      const plate = root?.getBoundingClientRect() ?? box;
      pointer.x = event.clientX <= box.right ? ((event.clientX - box.left) / box.width) * cols : cols * 0.62;
      pointer.y = ((event.clientY - plate.top) / plate.height) * rows;
      pointer.on = 1;
    };
    const onLeave = () => {
      pointer.on = 0;
    };
    const target = root ?? canvas;
    target.addEventListener("pointermove", onMove);
    target.addEventListener("pointerleave", onLeave);

    const ease = reduced ? 1 : 0.16;
    const started = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const reveal = reduced ? 1 : 1 - (1 - Math.min(1, (now - started) / 520)) ** 3;
      cursor.x += (pointer.x - cursor.x) * ease;
      cursor.y += (pointer.y - cursor.y) * ease;
      cursor.on += (pointer.on - cursor.on) * ease;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const progress = 0.3 * reveal;
      const reach = (col: number, row: number) => (Math.hypot(col - cursor.x, row - cursor.y) / rows) * 2.4 - 0.3 + (1 - cursor.on) * 2;
      for (const dot of dots) {
        const value = Math.min(dot.field, reach(dot.col, dot.row));
        const state = cellState(progress, value, dot.threshold);
        if (state === "rest") continue;
        ctx.fillStyle = state === "front" ? CYAN : BLUE;
        ctx.fillRect(dot.col * cell, dot.row * cell, cell, cell);
      }
      const glyph = Math.max(cell, GLYPH_MIN * dpr);
      const gCols = Math.ceil(canvas.width / glyph);
      const gRows = Math.ceil(canvas.height / glyph);
      ctx.fillStyle = CYAN;
      ctx.font = `600 ${Math.round(glyph * 0.78)}px ui-monospace, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let row = 0; row < gRows; row++) {
        for (let col = 0; col < gCols; col++) {
          const fineCol = Math.floor(((col + 0.5) * glyph) / cell);
          const fineRow = Math.floor(((row + 0.5) * glyph) / cell);
          const value = Math.min(
            field(fineCol, fineRow, fineRow / Math.max(1, rows - 1), seed),
            reach(fineCol, rows - 1 - fineRow),
          );
          if (cellState(progress, value, bayer8(col, row)) !== "front") continue;
          const mark = glyphAt(col, row);
          if (mark === " ") continue;
          const x = col * glyph;
          const y = canvas.height - (row + 1) * glyph;
          ctx.clearRect(x, y, glyph, glyph);
          ctx.fillText(mark, x + glyph / 2, y + glyph / 2);
        }
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
    };
  }, [seed]);

  return (
    <div aria-hidden className={`relative overflow-hidden bg-black ${className}`}>
      <canvas ref={ref} className="block size-full" />
    </div>
  );
}
