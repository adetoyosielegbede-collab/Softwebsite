"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { createDitherWash } from "./dither-wash";

function internalPath(event: MouseEvent) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return null;
  const anchor = (event.target as Element | null)?.closest?.("a[href]");
  if (!(anchor instanceof HTMLAnchorElement) || (anchor.target && anchor.target !== "_self") || anchor.hasAttribute("download")) return null;
  const url = new URL(anchor.href, window.location.href);
  if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return null;
  if (url.pathname.startsWith("/admin")) return null;
  return url.pathname + url.search + url.hash;
}

/** Cyan pixel wipe between pages. */
export function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const [paint, setPaint] = useState(0);
  const progress = useRef(0);
  const frame = useRef(0);
  const field = useRef<ReturnType<typeof createDitherWash>>(null);
  const fieldCanvas = useRef<HTMLCanvasElement | null>(null);
  const travelling = useRef(false);
  const seen = useRef(pathname);
  const destination = useRef<string | null>(null);

  const draw = useCallback((value: number) => {
    progress.current = value;
    const canvas = canvasRef.current;
    if (canvas && fieldCanvas.current !== canvas) {
      fieldCanvas.current = canvas;
      field.current = createDitherWash(canvas, 4);
    }
    field.current?.resize();
    field.current?.draw(value);
  }, []);

  const animate = useCallback(
    (to: number, duration: number, delay: number, done?: () => void) => {
      cancelAnimationFrame(frame.current);
      const from = progress.current;
      const start = performance.now() + delay;
      const step = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        const eased = t < 0.5 ? 2 * t * t : 1 - ((-2 * t + 2) ** 2) / 2;
        draw(from + (to - from) * eased);
        if (t < 1) frame.current = requestAnimationFrame(step);
        else done?.();
      };
      frame.current = requestAnimationFrame(step);
    },
    [draw],
  );

  const close = useCallback(() => {
    travelling.current = false;
    animate(0, 420, 110, () => setActive(false));
  }, [animate]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const onClick = (event: MouseEvent) => {
      const next = internalPath(event);
      if (!next || travelling.current) return;
      event.preventDefault();
      travelling.current = true;
      destination.current = next;
      setPaint((n) => n + 1);
      setActive(true);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [animate, close, router]);

  useEffect(() => {
    if (!active || !travelling.current) return;
    let dropped = false;
    animate(1, 340, 0, () => {
      if (dropped) return;
      if (destination.current) router.push(destination.current);
      window.setTimeout(close, 4000);
    });
    return () => {
      dropped = true;
      cancelAnimationFrame(frame.current);
    };
  }, [active, paint, animate, close, router]);

  useEffect(() => {
    if (seen.current === pathname) return;
    seen.current = pathname;
    if (travelling.current) close();
  }, [pathname, close]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  if (!active) return null;
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[100]">
      <canvas key={paint} ref={canvasRef} className="absolute inset-0 size-full" />
    </div>
  );
}
