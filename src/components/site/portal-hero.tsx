"use client";

import { ArrowDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { HomeContent } from "@/lib/content-types";
import { createDitherWash } from "./dither-wash";
import { ConduitCanvas } from "./conduit-canvas";
import { range, smoothstep } from "./dither-math";
import { ArrowLink, PillLink } from "./links";

const GLYPHS = ["▖", "▗", "▘", "▝", "▚", "▞", "▙", "▟"];
const WASH_IN: [number, number] = [0.1, 0.28];
const SCRAMBLE: [number, number] = [0.26, 0.4];
const ACTIONS: [number, number] = [0.38, 0.43];
const WASH_OUT: [number, number] = [0.56, 0.72];
const STATEMENT_OUT: [number, number] = [0.58, 0.64];
const MISSION_IN: [number, number] = [0.7, 0.82];
const MISSION_CTA: [number, number] = [0.81, 0.88];
const STOPS = [0.5, MISSION_CTA[1]];

type Run = { text: string; accent: boolean };

function statementRuns(text: string): Run[] {
  const parts = text.split(/(\{[^}]+\})/g).filter(Boolean);
  return parts.map((part) =>
    part.startsWith("{") && part.endsWith("}")
      ? { text: part.slice(1, -1), accent: true }
      : { text: part, accent: false },
  );
}

function place(progress: number, span: [number, number], reduced: boolean) {
  return reduced ? 1 : smoothstep(range(progress, span));
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
  const wash = useRef<HTMLCanvasElement>(null);
  const cover = useRef<HTMLDivElement>(null);
  const statement = useRef<HTMLParagraphElement>(null);
  const actions = useRef<HTMLDivElement>(null);
  const missionLayer = useRef<HTMLDivElement>(null);
  const missionCopy = useRef<HTMLDivElement>(null);
  const missionCta = useRef<HTMLDivElement>(null);
  const runs = statementRuns(intro.text);

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const canvas = wash.current;
    const field = canvas ? createDitherWash(canvas, 2) : null;
    const chars = [...(statement.current?.querySelectorAll<HTMLElement>("[data-ch]") ?? [])];
    let frame = 0;
    let introFrame = 0;
    let floor = 0;

    const render = () => {
      frame = 0;
      const span = root.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, span)));
      const still = reduced.matches;
      const fading = smoothstep(range(progress, WASH_OUT));
      const washAmount = Math.max(still ? 0 : progress < WASH_OUT[0] ? smoothstep(range(progress, WASH_IN)) : 1 - fading, floor);
      field?.resize();
      field?.draw(washAmount);
      if (cover.current) cover.current.style.opacity = String(field ? 0 : washAmount);

      const statementFade = still ? 0 : smoothstep(range(progress, STATEMENT_OUT));
      const cursor = (still ? 1 : range(progress, SCRAMBLE)) * (chars.length + 14);
      for (let i = 0; i < chars.length; i++) {
        const state = i < cursor - 14 ? "done" : i < cursor ? "scramble" : "hidden";
        const el = chars[i];
        if (el.dataset.state !== state) el.dataset.state = state;
        if (state === "scramble") el.dataset.glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      if (statement.current) statement.current.style.opacity = String(1 - statementFade);

      const actionAmount = (still ? 1 : smoothstep(range(progress, ACTIONS))) * (1 - statementFade);
      if (actions.current) {
        actions.current.style.opacity = String(actionAmount);
        actions.current.style.transform = `translateY(${(1 - actionAmount) * 16}px)`;
        actions.current.inert = actionAmount < 0.5;
      }
      if (missionLayer.current && !still) {
        missionLayer.current.style.visibility = progress >= WASH_IN[1] ? "visible" : "hidden";
      }
      const fadeBlock = (el: HTMLElement | null, amount: number) => {
        if (!el) return;
        el.style.opacity = String(amount);
        el.style.transform = `translateY(${(1 - amount) * 24}px)`;
        el.inert = amount < 0.5;
      };
      fadeBlock(missionCopy.current, place(progress, MISSION_IN, still));
      fadeBlock(missionCta.current, place(progress, MISSION_CTA, still));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const html = document.documentElement;
    if (html.classList.contains("play-intro") && !reduced.matches) {
      floor = 1;
      const started = performance.now();
      const play = (now: number) => {
        const t = Math.min(1, (now - started) / 1500);
        floor = 1 - smoothstep(t);
        render();
        if (t < 1) introFrame = requestAnimationFrame(play);
        else {
          floor = 0;
          html.classList.remove("play-intro");
          render();
        }
      };
      introFrame = requestAnimationFrame(play);
    }

    render();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    reduced.addEventListener("change", schedule);
    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(introFrame);
      floor = 0;
      html.classList.remove("play-intro");
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduced.removeEventListener("change", schedule);
    };
  }, []);

  const scrollOn = () => {
    const root = track.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = window.scrollY + root.getBoundingClientRect().top;
    const span = root.offsetHeight - window.innerHeight;
    const progress = (window.scrollY - top) / Math.max(1, span);
    const next = STOPS.find((stop) => stop > progress + 0.01);
    const destination = next === undefined || reduced ? top + root.offsetHeight : top + span * next;
    window.scrollTo({ top: destination, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <div className="bg-paper text-ink">
      <div ref={track} className="h-[460vh] motion-reduce:h-auto">
        <div className="sticky top-0 isolate h-svh overflow-hidden motion-reduce:relative motion-reduce:h-auto motion-reduce:min-h-svh">
          <section className="dark absolute inset-0 flex flex-col justify-end bg-black text-ink motion-reduce:relative motion-reduce:min-h-svh">
            <div aria-hidden className="absolute inset-0">
              {hero.backgroundImage.src ? (
                <CmsImage image={hero.backgroundImage} file="home" path="hero.backgroundImage" priority />
              ) : (
                <ConduitCanvas />
              )}
            </div>
            <div data-hero-copy="" className="container-site relative flex items-end justify-between gap-6 pb-24 md:pb-28">
              <h1 className="display text-[2.4rem] leading-[1.02] sm:text-6xl lg:text-7xl">
                <span className="block">{hero.titleLine1}</span>
                <span className="block text-ink-soft">{hero.titleLine2}</span>
              </h1>
              <button
                type="button"
                aria-label="Scroll"
                onClick={scrollOn}
                className="mb-3 hidden shrink-0 rounded-full p-2 text-ink-soft hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal sm:block"
              >
                <span className="softcom-nudge block">
                  <ArrowDown className="size-5" />
                </span>
              </button>
            </div>
          </section>

          <div
            ref={missionLayer}
            aria-label="Our mission"
            role="group"
            className="dark invisible absolute inset-0 z-[5] flex flex-col items-center justify-center gap-8 px-6 text-center text-white motion-reduce:visible motion-reduce:relative motion-reduce:min-h-[90vh] motion-reduce:py-24"
          >
            <CmsImage image={mission.image} file="home" path="mission.image" className="-z-10 object-cover object-bottom" />
            <div aria-hidden className="absolute inset-0 -z-10 bg-black/60" />
            <div ref={missionCopy} className="flex flex-col items-center gap-8 opacity-0 motion-reduce:opacity-100">
              <img src="/brand/accent-dot.svg" alt="" width={26} height={26} className="size-[26px]" />
              <h2 className="display max-w-3xl text-4xl leading-tight sm:text-5xl">{mission.title}</h2>
              <p className="max-w-lg text-sm leading-relaxed text-white/80">{mission.text}</p>
            </div>
            <div ref={missionCta} className="opacity-0 motion-reduce:opacity-100">
              <PillLink href={mission.ctaHref}>{mission.ctaLabel}</PillLink>
            </div>
          </div>

          <div ref={cover} aria-hidden className="softcom-intro-cover pointer-events-none absolute inset-0 z-[6] bg-brand opacity-0 motion-reduce:hidden" />
          <canvas ref={wash} aria-hidden className="softcom-intro-wash pointer-events-none absolute inset-0 z-[6] size-full motion-reduce:hidden" />

          <div className="pointer-events-none absolute inset-0 z-[7] flex flex-col items-start justify-center gap-10 px-6 pt-24 pb-12 text-white motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-[70vh] motion-reduce:bg-brand motion-reduce:py-16 md:px-[7vw]">
            <p className="sr-only">{runs.map((run) => run.text).join("")}</p>
            <p
              ref={statement}
              aria-hidden
              className="max-w-[1140px] font-heading text-[clamp(26px,3.6vw,58px)] leading-[1.25] font-light tracking-[-0.035em]"
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
    </div>
  );
}
