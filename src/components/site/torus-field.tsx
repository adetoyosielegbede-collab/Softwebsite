"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Dotted torus behind the insights hero.
 * Motion matches the WorldQuant Foundry insights field: a point-cloud ring
 * that slowly rolls and bobs, fading out at the top and bottom of the hero.
 */
const MAJOR = 3;
const MINOR = 1;
const TUBULAR = 160;
const RADIAL = 64;
const DEG = Math.PI / 180;

function buildPoints() {
  const pts = new Float32Array(TUBULAR * RADIAL * 3);
  let n = 0;
  for (let i = 0; i < TUBULAR; i++) {
    const u = (i / TUBULAR) * Math.PI * 2;
    const cu = Math.cos(u);
    const su = Math.sin(u);
    for (let j = 0; j < RADIAL; j++) {
      const v = (j / RADIAL) * Math.PI * 2;
      const ring = MAJOR + MINOR * Math.cos(v);
      pts[n++] = ring * cu;
      pts[n++] = MINOR * Math.sin(v);
      pts[n++] = ring * su;
    }
  }
  return pts;
}

const POINTS = buildPoints();

export function TorusField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const probe = document.createElement("span");
    probe.style.display = "none";
    canvas.parentElement?.appendChild(probe);
    const readColor = () => {
      probe.style.color = "var(--color-ink-faint)";
      return getComputedStyle(probe).color;
    };

    let color = readColor();
    let width = 0;
    let height = 0;
    let raf = 0;
    let last = 0;
    let time = reduced ? 1.2 : 0;

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const sway = Math.sin(time);
      const rx = 20 * DEG * sway;
      const ry = (90 + 20 * sway) * DEG;
      const rz = -time;
      const ox = 0;
      // Foundry parks the ring high in a short header. Our hero is a full band, so the rest position sits behind the title.
      const oy = 1.15 + 0.3 * sway;
      const oz = 14;
      const cx = Math.cos(rx);
      const sx = Math.sin(rx);
      const cy = Math.cos(ry);
      const sy = Math.sin(ry);
      const cz = Math.cos(rz);
      const sz = Math.sin(rz);
      // Three.js Euler XYZ, column-major.
      const m00 = cy * cz;
      const m01 = -cy * sz;
      const m02 = sy;
      const m10 = sx * sy * cz + cx * sz;
      const m11 = cx * cz - sx * sy * sz;
      const m12 = -sx * cy;
      const m20 = sx * sz - cx * sy * cz;
      const m21 = sx * cz + cx * sy * sz;
      const m22 = cx * cy;

      ctx.clearRect(0, 0, width, height);
      const focal = height / 2 / Math.tan(30 * DEG);
      const camZ = 15;
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.85;
      const count = POINTS.length / 3;
      for (let i = 0; i < count; i++) {
        const x = POINTS[i * 3];
        const y = POINTS[i * 3 + 1];
        const z = POINTS[i * 3 + 2];
        const wx = m00 * x + m01 * y + m02 * z + ox;
        const wy = m10 * x + m11 * y + m12 * z + oy;
        const wz = m20 * x + m21 * y + m22 * z + oz;
        const dist = camZ - wz;
        if (dist < 0.35) continue;
        const scale = focal / dist;
        const sx1 = width / 2 + wx * scale;
        const sy1 = height / 2 - wy * scale;
        if (sx1 < -12 || sy1 < -12 || sx1 > width + 12 || sy1 > height + 12) continue;
        const size = Math.max(1.1, (0.04 * 170) / dist);
        ctx.fillRect(sx1 - size / 2, sy1 - size / 2, size, size);
      }
      ctx.globalAlpha = 1;
    };

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(() => {
      color = readColor();
      draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    resize();
    draw();

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      if (last && now - last < 32) return;
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 0.016;
      last = now;
      time += dt * 0.3;
      draw();
    };
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      mo.disconnect();
      probe.remove();
    };
  }, []);

  const mask = "linear-gradient(to bottom, transparent 0%, #000 18%, #000 76%, transparent 100%)";
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
