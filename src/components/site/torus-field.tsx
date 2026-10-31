"use client";

import { useLayoutEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Dotted torus fields for interior heroes.
 * `band` is the Insights ring: one tube rolling behind the title.
 * `armillary` is the About field: one ring, drawn in black and grey.
 * `portals` is the Solutions field: two rings, blue on the left and cyan on the right.
 */
const MAJOR = 3;
const MINOR = 1;
const DEG = Math.PI / 180;

function buildPoints(tubular: number, radial: number) {
  const pts = new Float32Array(tubular * radial * 3);
  let n = 0;
  for (let i = 0; i < tubular; i++) {
    const u = (i / tubular) * Math.PI * 2;
    const cu = Math.cos(u);
    const su = Math.sin(u);
    for (let j = 0; j < radial; j++) {
      const v = (j / radial) * Math.PI * 2;
      const ring = MAJOR + MINOR * Math.cos(v);
      pts[n++] = ring * cu;
      pts[n++] = MINOR * Math.sin(v);
      pts[n++] = ring * su;
    }
  }
  return pts;
}

const POINTS = buildPoints(160, 64);
const ORBIT = buildPoints(120, 46);

type Variant = "band" | "armillary" | "portals";

const BLUE = "#004bff";
const CYAN = "#00ffff";

const MASKS: Record<Variant, string> = {
  band: "linear-gradient(to bottom, transparent 0%, #000 18%, #000 76%, transparent 100%)",
  armillary: "radial-gradient(ellipse 76% 70% at 50% 44%, #000 0%, #000 36%, transparent 74%)",
  portals: "radial-gradient(ellipse 92% 72% at 50% 46%, #000 0%, #000 48%, transparent 80%)",
};

export function TorusField({ variant = "band", className }: { variant?: Variant; className?: string }) {
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

    const drawRing = (pts: Float32Array, pose: { rx: number; ry: number; rz: number; ox: number; oy: number; oz: number }, ink: string, alpha: number, attenuation: number) => {
      const cx = Math.cos(pose.rx);
      const sx = Math.sin(pose.rx);
      const cy = Math.cos(pose.ry);
      const sy = Math.sin(pose.ry);
      const cz = Math.cos(pose.rz);
      const sz = Math.sin(pose.rz);
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
      const focal = height / 2 / Math.tan(30 * DEG);
      const camZ = 15;
      ctx.fillStyle = ink;
      ctx.globalAlpha = alpha;
      const count = pts.length / 3;
      for (let i = 0; i < count; i++) {
        const x = pts[i * 3];
        const y = pts[i * 3 + 1];
        const z = pts[i * 3 + 2];
        const wx = m00 * x + m01 * y + m02 * z + pose.ox;
        const wy = m10 * x + m11 * y + m12 * z + pose.oy;
        const wz = m20 * x + m21 * y + m22 * z + pose.oz;
        const dist = camZ - wz;
        if (dist < 0.35) continue;
        const scale = focal / dist;
        const sx1 = width / 2 + wx * scale;
        const sy1 = height / 2 - wy * scale;
        if (sx1 < -12 || sy1 < -12 || sx1 > width + 12 || sy1 > height + 12) continue;
        const raw = Math.max(1.05, (0.04 * attenuation) / dist);
        const size = variant === "band" ? raw : Math.min(2.2, raw);
        ctx.fillRect(sx1 - size / 2, sy1 - size / 2, size, size);
      }
    };

    const drawFlakes = () => {
      const focal = height / 2 / Math.tan(30 * DEG);
      const camZ = 15;
      const z = 12.2;
      const dist = camZ - z;
      const scale = focal / dist;
      ctx.fillStyle = BLUE;
      for (let i = 0; i < 42; i++) {
        const p = (time * 0.18 + i / 42) % 1;
        const fade = Math.sin(p * Math.PI);
        const x = -4.6 + p * 9.2;
        const y = 0.15 + Math.sin(p * Math.PI * 2 + i * 1.7) * 0.42;
        const sx = width / 2 + x * scale;
        const sy = height / 2 - y * scale;
        const size = Math.max(1.15, (0.05 * 140) / dist) * (0.55 + fade * 0.7);
        ctx.globalAlpha = 0.2 + 0.75 * fade;
        ctx.fillRect(sx - size / 2, sy - size / 2, size, size);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      if (variant === "portals") {
        drawRing(ORBIT, { rx: time * 0.85, ry: 0.62, rz: 0.28, ox: -4.6, oy: 0.15, oz: 12.2 }, BLUE, 0.95, 150);
        drawRing(ORBIT, { rx: -time * 0.72, ry: -0.48, rz: 0.18, ox: 4.6, oy: 0.15, oz: 12.2 }, CYAN, 0.95, 150);
        drawFlakes();
        ctx.globalAlpha = 1;
        return;
      }
      if (variant === "armillary") {
        const sway = Math.sin(time * 0.55);
        drawRing(
          ORBIT,
          { rx: 18 * DEG * sway, ry: 12 * DEG + time * 0.14, rz: -time * 0.2, ox: 0, oy: 0.15 + 0.12 * sway, oz: 10.5 },
          color,
          0.85,
          160,
        );
      } else {
        const sway = Math.sin(time);
        // Foundry parks the ring high in a short header. Our hero is a full band, so the rest position sits behind the title.
        drawRing(POINTS, { rx: 20 * DEG * sway, ry: (90 + 20 * sway) * DEG, rz: -time, ox: 0, oy: 1.15 + 0.3 * sway, oz: 14 }, color, 0.85, 170);
      }
      ctx.globalAlpha = 1;
    };

    const paintTheme = () => {
      color = readColor();
      draw();
    };
    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);
    const mo = new MutationObserver(paintTheme);
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
  }, [variant]);

  const mask = MASKS[variant];
  return (
    <canvas
      ref={ref}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 size-full", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
    />
  );
}
