"use client";

import { ArrowDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import type { HomeContent } from "@/lib/content-types";
import { createDitherWash } from "./dither-wash";
import { range, smoothstep } from "./dither-math";
import { ArrowLink, PillLink } from "./links";

const BLUE = "#004bff";
const CYAN = "#00ffff";
const GLYPHS = ["▖", "▗", "▘", "▝", "▚", "▞", "▙", "▟"];
const WASH_IN: [number, number] = [0.08, 0.24];
const SCRAMBLE: [number, number] = [0.22, 0.4];
const ACTIONS: [number, number] = [0.36, 0.44];
const WASH_OUT: [number, number] = [0.58, 0.78];
const STATEMENT_OUT: [number, number] = [0.6, 0.7];

type Run = { text: string; accent: boolean };
type Tone = "grey" | "blue" | "cyan";
type Cell = { x: number; y: number; letter: boolean; tone: Tone };

function statementRuns(text: string): Run[] {
  return text
    .split(/(\{[^}]+\})/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith("{") && part.endsWith("}")
        ? { text: part.slice(1, -1), accent: true }
        : { text: part, accent: false },
    );
}

function splitTitle(title: string) {
  const parts = title.trim().split(/\s+/);
  if (parts.length < 2) return [title.trim(), ""] as const;
  const tail = parts.pop() ?? "";
  return [parts.join(" "), tail] as const;
}

function mixTone(tone: string, morph: number) {
  if (morph <= 0) return tone;
  const [r, g, b] = tone.split(",").map(Number);
  const mix = (channel: number) => Math.round(channel + (255 - channel) * morph);
  return `${mix(r)},${mix(g)},${mix(b)}`;
}

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}

function placeOrb(el: HTMLElement, x: number, y: number, radius: number, color: string, opacity: number) {
  const size = radius * 2;
  el.style.position = "absolute";
  el.style.left = `${x - radius}px`;
  el.style.top = `${y - radius}px`;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.animation = "none";
  el.style.transform = "none";
  el.style.opacity = String(opacity);
  el.style.background = color;
  el.style.boxShadow = radius < 70 ? `0 0 ${radius * 1.4}px ${color}` : "none";
}

export function PortalHero({
  hero,
  intro,
  mission,
}: {
  hero: HomeContent["hero"];
  intro: HomeContent["intro"];
  mission: HomeContent["mission"];
}) {
  const track = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const cue = useRef<HTMLButtonElement>(null);
  const blue = useRef<HTMLSpanElement>(null);
  const cyan = useRef<HTMLSpanElement>(null);
  const scene = useRef<HTMLElement>(null);
  const world = useRef<HTMLCanvasElement>(null);
  const copy = useRef<HTMLDivElement>(null);
  const lineA = useRef<HTMLSpanElement>(null);
  const lineB = useRef<HTMLSpanElement>(null);
  const wash = useRef<HTMLCanvasElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const runs = statementRuns(intro.text);
  const [lead, tail] = splitTitle(hero.titleLine2);

  useLayoutEffect(() => {
    const root = track.current;
    const frame = stage.current;
    const blueEl = blue.current;
    const cyanEl = cyan.current;
    const sceneEl = scene.current;
    const grid = world.current;
    const gridCtx = grid?.getContext("2d");
    if (!root || !frame || !blueEl || !cyanEl || !sceneEl || !grid || !gridCtx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const field = wash.current ? createDitherWash(wash.current, 2) : null;
    const chars = [...(statement.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? [])];
    const mask = document.createElement("canvas");
    const maskCtx = mask.getContext("2d", { willReadFrequently: true });
    let cells: Cell[] = [];
    let square = 8;
    let built = "";
    let raf = 0;
    document.documentElement.classList.remove("play-intro");

    const rebuild = () => {
      const width = grid.clientWidth;
      const height = grid.clientHeight;
      const first = lineA.current?.getBoundingClientRect();
      const stageBox = grid.getBoundingClientRect();
      if (width < 2 || height < 2 || !first || !maskCtx) return;
      const key = `${width}x${height}:${Math.round(first.top)}:${Math.round(first.width)}:${lead}:${tail}`;
      if (key === built) return;
      built = key;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      grid.width = Math.round(width * dpr);
      grid.height = Math.round(height * dpr);
      gridCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      mask.width = width;
      mask.height = height;
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.fillStyle = "#fff";
      maskCtx.textAlign = "center";
      maskCtx.textBaseline = "middle";
      const family = getComputedStyle(lineA.current ?? document.body).fontFamily;
      const longer = lead.length >= tail.length ? lead : tail;
      maskCtx.font = `500 100px ${family}`;
      const measured = Math.max(1, maskCtx.measureText(longer || "Society").width);
      const fontSize = Math.round(Math.min(168, height * 0.2, (100 * width * 0.88) / measured));
      maskCtx.font = `500 ${fontSize}px ${family}`;
      const lineGap = fontSize * 0.92;
      const firstBox = lineA.current?.getBoundingClientRect();
      const secondBox = lineB.current?.getBoundingClientRect();
      const midY =
        firstBox && secondBox
          ? (firstBox.top + secondBox.bottom) / 2 - stageBox.top
          : height * 0.46;
      if (lead) maskCtx.fillText(lead, width / 2, midY - lineGap / 2);
      if (tail) maskCtx.fillText(tail, width / 2, midY + lineGap / 2);
      const pixels = maskCtx.getImageData(0, 0, width, height).data;

      const pitch = Math.max(8, Math.min(22, Math.round(fontSize * 0.12)));
      square = Math.max(3, Math.round(pitch * 0.46));
      const cols = Math.ceil(width / pitch) + 1;
      const rows = Math.ceil(height / pitch) + 1;
      const originX = (width - (cols - 1) * pitch) / 2;
      const originY = (height - (rows - 1) * pitch) / 2;
      const sample = Math.max(2, Math.round(square * 0.55));
      const next: Cell[] = [];
      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const x = originX + col * pitch;
          const y = originY + row * pitch;
          let hits = 0;
          for (let oy = -sample; oy <= sample; oy += 2) {
            const py = Math.round(y + oy);
            if (py < 0 || py >= height) continue;
            for (let ox = -sample; ox <= sample; ox += 2) {
              const px = Math.round(x + ox);
              if (px < 0 || px >= width) continue;
              if (pixels[(py * width + px) * 4 + 3] > 40) hits += 1;
            }
          }
          const n = hash(col, row);
          const tone: Tone = n > 0.985 ? "blue" : n > 0.97 ? "cyan" : "grey";
          next.push({ x, y, letter: hits >= 2, tone });
        }
      }
      cells = next;
    };

    const drawGrid = (morph: number, shown: number, time: number) => {
      const width = grid.clientWidth;
      const height = grid.clientHeight;
      gridCtx.clearRect(0, 0, width, height);
      const breathe = 0.9 + 0.1 * Math.sin(time * 1.1);
      for (const cell of cells) {
        const tone = cell.tone === "blue" ? "0,75,255" : cell.tone === "cyan" ? "0,255,255" : "230,230,226";
        const idle = (cell.tone === "grey" ? 0.78 : 0.95) * breathe;
        const presence = cell.letter ? shown : Math.max(0.07, 1 - morph * 0.93);
        const scale = cell.letter ? 1 + morph * 0.85 : 1 - morph * 0.35;
        const size = Math.max(2, square * scale);
        const color = cell.letter ? mixTone(tone, Math.min(1, morph * 1.15)) : tone;
        const alpha = (cell.letter ? idle + (1 - idle) * morph : idle * 0.9) * presence;
        if (alpha < 0.03) continue;
        const left = Math.round(cell.x - size / 2);
        const top = Math.round(cell.y - size / 2);
        gridCtx.fillStyle = `rgba(${color},${alpha})`;
        gridCtx.fillRect(left, top, Math.round(size), Math.round(size));
      }
    };

    const render = (now: number) => {
      rebuild();
      const span = root.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, span)));
      const still = reduced.matches;
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      const washP = still ? 1 : range(progress, [0.62, 1]);
      const fading = smoothstep(range(washP, WASH_OUT));
      const washAmount = still ? 0 : washP < WASH_OUT[0] ? smoothstep(range(washP, WASH_IN)) : 1 - fading;
      const morph = still ? 1 : smoothstep(range(progress, [0.3, 0.46]));
      const mosaic = still ? 0 : (1 - smoothstep(range(progress, [0.48, 0.58]))) * (1 - washAmount);
      const shown = still ? 1 : smoothstep(range(progress, [0.54, 0.66])) * (1 - washAmount);
      drawGrid(morph, mosaic, now / 1000);

      if (copy.current) {
        copy.current.style.opacity = String(shown);
        copy.current.style.transform = `translateY(${(1 - Math.min(1, shown)) * 18}px)`;
      }

      if (still) {
        sceneEl.style.opacity = "1";
        sceneEl.style.maskImage = "none";
        sceneEl.style.webkitMaskImage = "none";
        if (statement.current) statement.current.style.opacity = "1";
        if (actions.current) {
          actions.current.style.opacity = "1";
          actions.current.style.transform = "none";
          actions.current.inert = false;
        }
        return;
      }

      const meet = smoothstep(range(progress, [0.03, 0.14]));
      const zoomT = smoothstep(range(progress, [0.12, 0.3]));
      const titleFade = smoothstep(range(progress, [0.1, 0.2]));
      const titleBox = title.current?.getBoundingClientRect();
      const frameBox = frame.getBoundingClientRect();
      const baseR = Math.max(16, Math.min(30, Math.min(width, height) * 0.032));
      const anchorY = titleBox ? titleBox.bottom - frameBox.top + baseR + 36 : height * 0.58;
      const cx = width / 2;
      const cy = Math.max(height * 0.42, Math.min(height * 0.7, anchorY));
      const coverR = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) * 1.04;
      const calm = 1 - smoothstep(range(progress, [0.02, 0.08]));
      const radius = baseR * Math.pow(coverR / baseR, zoomT);
      const time = now / 1000;
      const restD = baseR * 2 + Math.max(18, baseR * 0.7);
      const d = restD * (1 - meet) * (1 - zoomT) + radius * 1.05 * (1 - zoomT) * meet;
      const r1 = radius * (1 + calm * 0.07 * Math.sin(time * 2.1));
      const r2 = radius * (1 + calm * 0.07 * Math.sin(time * 2.1 + 1.35));
      const orbFade = 1 - smoothstep(range(zoomT, [0.38, 0.68]));
      placeOrb(blueEl, cx - d / 2, cy, r1, BLUE, orbFade);
      placeOrb(cyanEl, cx + d / 2, cy, r2, CYAN, orbFade);

      const open = zoomT > 0.97 && d < 2;
      sceneEl.style.opacity = progress > 0.05 ? "1" : String(meet);
      if (open) {
        sceneEl.style.maskImage = "none";
        sceneEl.style.webkitMaskImage = "none";
      } else {
        const portal = `radial-gradient(circle ${r1}px at ${cx - d / 2}px ${cy}px, #000 98.5%, transparent 100%), radial-gradient(circle ${r2}px at ${cx + d / 2}px ${cy}px, #000 98.5%, transparent 100%)`;
        sceneEl.style.maskImage = portal;
        sceneEl.style.webkitMaskImage = portal;
        sceneEl.style.maskComposite = "intersect";
        sceneEl.style.webkitMaskComposite = "source-in";
        sceneEl.style.maskRepeat = "no-repeat";
        sceneEl.style.webkitMaskRepeat = "no-repeat";
      }
      if (title.current) {
        title.current.style.opacity = String(1 - titleFade);
        title.current.style.transform = `translateY(${-titleFade * 28}px)`;
      }
      if (cue.current) {
        const cueAmount = 1 - smoothstep(range(progress, [0.02, 0.08]));
        cue.current.style.opacity = String(cueAmount);
        cue.current.inert = cueAmount < 0.5;
      }

      field?.resize();
      field?.draw(washAmount);
      const statementFade = smoothstep(range(washP, STATEMENT_OUT));
      const cursor = range(washP, SCRAMBLE) * (chars.length + 14);
      for (let i = 0; i < chars.length; i++) {
        const state = i < cursor - 14 ? "done" : i < cursor ? "scramble" : "hidden";
        const el = chars[i];
        if (el.dataset.state !== state) el.dataset.state = state;
        if (state === "scramble") el.dataset.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      if (statement.current) statement.current.style.opacity = String(1 - statementFade);
      const actionAmount = smoothstep(range(washP, ACTIONS)) * (1 - statementFade);
      if (actions.current) {
        actions.current.style.opacity = String(actionAmount);
        actions.current.style.transform = `translateY(${(1 - actionAmount) * 16}px)`;
        actions.current.inert = actionAmount < 0.5;
      }
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden) return;
      const box = root.getBoundingClientRect();
      if (box.bottom < -40 || box.top > window.innerHeight + 40) return;
      render(now);
    };

    render(performance.now());
    raf = requestAnimationFrame(loop);
    const onChange = () => {
      built = "";
      render(performance.now());
    };
    reduced.addEventListener("change", onChange);
    document.fonts?.ready.then(onChange).catch(() => {});
    return () => {
      cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onChange);
    };
  }, [lead, tail]);

  const scrollOn = () => {
    const root = track.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = window.scrollY + root.getBoundingClientRect().top;
    const span = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: reduced ? top + root.offsetHeight : top + span * 0.36, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <div ref={track} className="h-[520vh] bg-black sm:h-[640vh] motion-reduce:h-auto motion-reduce:bg-transparent">
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
        <section className="dark absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-ink motion-reduce:relative motion-reduce:min-h-svh motion-reduce:py-32">
          <div aria-hidden className="portal-grain absolute inset-0" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(0_0_0/0.55)_78%,#000_100%)]" />
          <h1 ref={title} className="text-display relative max-w-[9em]">
            {hero.titleLine1}
          </h1>
          <div aria-hidden className="mt-10 flex h-11 items-center justify-center gap-7">
            <span ref={blue} className="portal-pulse size-11 rounded-full" style={{ background: BLUE, boxShadow: `0 0 22px ${BLUE}` }} />
            <span ref={cyan} className="portal-pulse size-11 rounded-full [animation-delay:-1.1s]" style={{ background: CYAN, boxShadow: `0 0 22px ${CYAN}` }} />
          </div>
          <button
            ref={cue}
            type="button"
            aria-label="Scroll"
            onClick={scrollOn}
            className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full p-2 text-white/70 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal motion-reduce:hidden"
          >
            <span className="softcom-nudge block">
              <ArrowDown className="size-5" />
            </span>
          </button>
        </section>

        <section
          ref={scene}
          aria-label={hero.titleLine2}
          className="pointer-events-none absolute inset-0 z-20 overflow-hidden bg-black opacity-0 motion-reduce:relative motion-reduce:min-h-svh motion-reduce:opacity-100"
        >
          <canvas ref={world} aria-hidden className="absolute inset-0 size-full" />
          <div ref={copy} className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white opacity-0 motion-reduce:opacity-100">
            <h2 className="text-display max-w-[10em]">
              <span ref={lineA} className="block">
                {lead}
              </span>
              {tail ? (
                <span ref={lineB} className="block">
                  {tail}
                </span>
              ) : null}
            </h2>
            <p className="text-lede mt-6 max-w-[36rem] text-white/80">{mission.text}</p>
          </div>
        </section>

        <canvas ref={wash} aria-hidden className="pointer-events-none absolute inset-0 z-40 size-full motion-reduce:hidden" />

        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-start justify-center gap-10 px-6 pt-24 pb-12 text-white motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-[70vh] motion-reduce:bg-brand motion-reduce:py-16 md:px-[7vw]">
          <p className="sr-only">{runs.map((run) => run.text).join("")}</p>
          <p
            ref={statement}
            aria-hidden
            className="max-w-[1140px] font-heading text-[clamp(2.25rem,4.2vw,3.75rem)] leading-[0.95] font-medium"
          >
            {runs.map((run) =>
              [...run.text].map((char, index) =>
                char === " " ? (
                  " "
                ) : (
                  <span
                    key={`${run.text}-${index}`}
                    data-ch=""
                    data-state="hidden"
                    className={
                      "relative data-[state=hidden]:text-transparent data-[state=scramble]:text-transparent after:pointer-events-none after:absolute after:inset-0 after:text-signal data-[state=scramble]:after:content-[attr(data-glyph)] " +
                      (run.accent ? "text-signal" : "")
                    }
                  >
                    {char}
                  </span>
                ),
              ),
            )}
          </p>
          <div ref={actions} className="pointer-events-auto flex flex-wrap items-center gap-x-8 gap-y-4 opacity-0 motion-reduce:opacity-100">
            <PillLink href={intro.primaryHref} className="bg-white text-black hover:bg-signal">
              {intro.primaryLabel}
            </PillLink>
            <ArrowLink href={intro.secondaryHref} className="text-white hover:text-signal">
              {intro.secondaryLabel}
            </ArrowLink>
          </div>
        </div>
      </div>
    </div>
  );
}
