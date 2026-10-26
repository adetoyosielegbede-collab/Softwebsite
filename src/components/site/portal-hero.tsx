"use client";

import { ArrowDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { HomeContent } from "@/lib/content-types";
import { createDitherWash } from "./dither-wash";
import { clamp01, range, smoothstep } from "./dither-math";
import { ArrowLink, PillLink } from "./links";

const BLUE = "#004bff";
const CYAN = "#00ffff";
const GLYPHS = ["▖", "▗", "▘", "▝", "▚", "▞", "▙", "▟"];
const WASH_IN: [number, number] = [0.08, 0.24];
const SCRAMBLE: [number, number] = [0.22, 0.4];
const ACTIONS: [number, number] = [0.36, 0.44];
const WASH_END = 0.6;

type Run = { text: string; accent: boolean };

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
  const opening = useRef<HTMLElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const cue = useRef<HTMLButtonElement>(null);
  const blue = useRef<HTMLSpanElement>(null);
  const cyan = useRef<HTMLSpanElement>(null);
  const scene = useRef<HTMLElement>(null);
  const headline = useRef<HTMLHeadingElement>(null);
  const sub = useRef<HTMLParagraphElement>(null);
  const wash = useRef<HTMLCanvasElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const runs = statementRuns(intro.text);
  const [lead, tail] = splitTitle(hero.titleLine2);
  const words = mission.text.trim().split(/\s+/);
  const imageMode = Boolean(hero.imageMode && hero.backgroundImage?.src);

  useLayoutEffect(() => {
    const root = track.current;
    const frame = stage.current;
    const blueEl = blue.current;
    const cyanEl = cyan.current;
    const sceneEl = scene.current;
    if (!root || !frame || !blueEl || !cyanEl || !sceneEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const field = wash.current ? createDitherWash(wash.current, 2) : null;
    const chars = [...(statement.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? [])];
    const wordEls = [...(sub.current?.children ?? [])] as HTMLElement[];
    let raf = 0;
    document.documentElement.classList.remove("play-intro");

    const paintArrival = (landed: number, reveal: number, cover: number) => {
      if (headline.current) {
        headline.current.style.opacity = String(landed * cover);
        headline.current.style.transform = `translateY(${(1 - landed) * 18}px)`;
      }
      wordEls.forEach((el, index) => {
        const local = smoothstep(clamp01((reveal * (wordEls.length + 5) - index) / 5));
        el.style.opacity = String(local * cover);
        el.style.transform = `translateY(${(1 - local) * 8}px)`;
      });
    };

    const render = (now: number) => {
      const span = root.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, span)));
      const still = reduced.matches;
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      const washP = still ? 1 : range(progress, [0.66, 1]) * WASH_END;
      const washAmount = still ? 0 : smoothstep(range(washP, WASH_IN));
      const behindWash = !still && washP >= WASH_IN[1];
      const cover = behindWash ? 0 : 1 - washAmount;
      const landed = still ? 1 : smoothstep(range(progress, [0.22, 0.34]));
      const reveal = still ? 1 : range(progress, [0.4, 0.6]);
      paintArrival(landed, reveal, cover);
      if (opening.current) opening.current.style.visibility = behindWash ? "hidden" : "visible";

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
      sceneEl.style.opacity = behindWash ? "0" : progress > 0.05 ? "1" : String(meet);
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
      const cursor = range(washP, SCRAMBLE) * (chars.length + 14);
      for (let i = 0; i < chars.length; i++) {
        const state = i < cursor - 14 ? "done" : i < cursor ? "scramble" : "hidden";
        const el = chars[i];
        if (el.dataset.state !== state) el.dataset.state = state;
        if (state === "scramble") el.dataset.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      if (statement.current) statement.current.style.opacity = "1";
      const actionAmount = smoothstep(range(washP, ACTIONS));
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
    const onChange = () => render(performance.now());
    reduced.addEventListener("change", onChange);
    return () => {
      cancelAnimationFrame(raf);
      reduced.removeEventListener("change", onChange);
    };
  }, [words.length]);

  const scrollOn = () => {
    const root = track.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = window.scrollY + root.getBoundingClientRect().top;
    const span = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: reduced ? top + root.offsetHeight : top + span * 0.34, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <div ref={track} className="h-[520vh] bg-paper sm:h-[640vh] motion-reduce:h-auto motion-reduce:bg-transparent">
      <div ref={stage} className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
        <section ref={opening} className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-ink motion-reduce:relative motion-reduce:min-h-svh motion-reduce:py-32">
          <div aria-hidden className="absolute inset-0 bg-paper" />
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
            className="absolute bottom-6 left-1/2 z-40 -translate-x-1/2 rounded-full p-2 text-ink/70 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal motion-reduce:hidden"
          >
            <span className="softcom-nudge block">
              <ArrowDown className="size-5" />
            </span>
          </button>
        </section>

        <section
          ref={scene}
          aria-label={hero.titleLine2}
          style={imageMode ? ({ "--ink": "#fafafa" } as React.CSSProperties) : undefined}
          className={
            (imageMode ? "" : "portal-invert ") +
            "pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center overflow-hidden px-6 text-center text-ink opacity-0 motion-reduce:relative motion-reduce:min-h-svh motion-reduce:opacity-100 motion-reduce:py-32"
          }
        >
          {imageMode ? (
            <>
              <CmsImage image={hero.backgroundImage} file="home" path="hero.backgroundImage" />
              <div
                aria-hidden
                className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.55)_0%,rgb(0_0_0/0.4)_55%,rgb(0_0_0/0.65)_100%)]"
              />
            </>
          ) : (
            <>
              <div aria-hidden className="portal-grain absolute inset-0" />
              <div aria-hidden className="portal-vignette absolute inset-0" />
            </>
          )}
          <h2 ref={headline} className="text-display relative max-w-[9em] opacity-0 motion-reduce:opacity-100">
            <span className="block">{lead}</span>
            {tail ? <span className="block">{tail}</span> : null}
          </h2>
          <div className="relative mt-10 h-11 w-full max-w-[34rem]">
            <p ref={sub} className="text-lede absolute inset-x-0 top-0 text-ink/80">
              {words.map((word, index) => (
                <span
                  key={`${word}-${index}`}
                  className={
                    "inline-block opacity-0 motion-reduce:opacity-100" +
                    (index < words.length - 1 ? " pr-[0.32em]" : "")
                  }
                >
                  {word}
                </span>
              ))}
            </p>
          </div>
        </section>

        <canvas ref={wash} aria-hidden className="pointer-events-none absolute inset-0 z-40 size-full motion-reduce:hidden" />

        <div className="pointer-events-none absolute inset-0 z-50 flex flex-col items-start justify-center gap-10 px-6 pt-24 pb-12 text-white motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-[70vh] motion-reduce:bg-brand motion-reduce:py-16 md:px-[7vw]">
          <p className="sr-only">{runs.map((run) => run.text).join("")}</p>
          <p
            ref={statement}
            aria-hidden
            className="max-w-[1140px] font-heading text-[clamp(1.625rem,4.2vw,3.75rem)] leading-[1.05] heading-type md:leading-[0.95]"
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
