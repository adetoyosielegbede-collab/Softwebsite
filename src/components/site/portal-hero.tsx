"use client";

import { ArrowDown } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { CmsImage } from "@/components/cms/cms-image";
import type { HomeContent } from "@/lib/content-types";
import { range, smoothstep } from "./dither-math";
import { ArrowLink, PillLink } from "./links";

const BLUE = "#004bff";
const CYAN = "#00ffff";

function accentText(text: string) {
  return text.split(/(\{[^}]+\})/g).filter(Boolean).map((part, index) =>
    part.startsWith("{") && part.endsWith("}") ? (
      <span key={index} className="text-brand">
        {part.slice(1, -1)}
      </span>
    ) : (
      <span key={index}>{part}</span>
    ),
  );
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
  const world = useRef<HTMLDivElement>(null);
  const scrim = useRef<HTMLDivElement>(null);
  const copy = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = track.current;
    const frame = stage.current;
    const blueEl = blue.current;
    const cyanEl = cyan.current;
    const sceneEl = scene.current;
    if (!root || !frame || !blueEl || !cyanEl || !sceneEl) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    document.documentElement.classList.remove("play-intro");

    const render = (now: number) => {
      const span = root.offsetHeight - window.innerHeight;
      const progress = reduced.matches ? 1 : Math.max(0, Math.min(1, -root.getBoundingClientRect().top / Math.max(1, span)));
      const width = frame.clientWidth;
      const height = frame.clientHeight;
      const titleBox = title.current?.getBoundingClientRect();
      const frameBox = frame.getBoundingClientRect();
      const baseR = Math.max(16, Math.min(30, Math.min(width, height) * 0.032));
      const anchorY = titleBox ? titleBox.bottom - frameBox.top + baseR + 36 : height * 0.62;
      const cx = width / 2;
      const cy = Math.max(height * 0.42, Math.min(height * 0.72, anchorY));
      const coverR = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy)) * 1.04;

      if (reduced.matches) {
        sceneEl.style.opacity = "1";
        sceneEl.style.maskImage = "none";
        sceneEl.style.webkitMaskImage = "none";
        if (scrim.current) scrim.current.style.opacity = "1";
        if (copy.current) {
          copy.current.style.opacity = "1";
          copy.current.style.transform = "none";
          copy.current.inert = false;
        }
        return;
      }

      const meet = smoothstep(range(progress, [0.05, 0.36]));
      const zoomT = smoothstep(range(progress, [0.34, 0.84]));
      const arrive = smoothstep(range(progress, [0.76, 0.92]));
      const titleFade = smoothstep(range(progress, [0.24, 0.46]));
      const calm = 1 - smoothstep(range(progress, [0.02, 0.16]));
      const radius = baseR * Math.pow(coverR / baseR, zoomT);
      const time = now / 1000;
      const pulseA = 1 + calm * 0.07 * Math.sin(time * 2.1);
      const pulseB = 1 + calm * 0.07 * Math.sin(time * 2.1 + 1.35);
      const restD = baseR * 2 + Math.max(18, baseR * 0.7);
      const d = restD * (1 - meet) * (1 - zoomT) + radius * 1.05 * (1 - zoomT) * meet;
      const r1 = radius * pulseA;
      const r2 = radius * pulseB;
      const orbFade = 1 - smoothstep(range(zoomT, [0.38, 0.68]));

      placeOrb(blueEl, cx - d / 2, cy, r1, BLUE, orbFade);
      placeOrb(cyanEl, cx + d / 2, cy, r2, CYAN, orbFade);

      const open = zoomT > 0.97 && d < 2;
      sceneEl.style.opacity = progress > 0.08 ? "1" : String(meet);
      sceneEl.style.pointerEvents = arrive > 0.5 ? "auto" : "none";
      if (open) {
        sceneEl.style.maskImage = "none";
        sceneEl.style.webkitMaskImage = "none";
      } else {
        const mask = `radial-gradient(circle ${r1}px at ${cx - d / 2}px ${cy}px, #000 98.5%, transparent 100%), radial-gradient(circle ${r2}px at ${cx + d / 2}px ${cy}px, #000 98.5%, transparent 100%)`;
        sceneEl.style.maskImage = mask;
        sceneEl.style.webkitMaskImage = mask;
        sceneEl.style.maskComposite = "intersect";
        sceneEl.style.webkitMaskComposite = "source-in";
        sceneEl.style.maskRepeat = "no-repeat";
        sceneEl.style.webkitMaskRepeat = "no-repeat";
      }
      if (world.current) world.current.style.transform = `scale(${1.1 - zoomT * 0.1})`;
      if (scrim.current) scrim.current.style.opacity = String(arrive);
      if (title.current) {
        title.current.style.opacity = String(1 - titleFade);
        title.current.style.transform = `translateY(${-titleFade * 28}px)`;
      }
      if (cue.current) {
        cue.current.style.opacity = String(1 - smoothstep(range(progress, [0.02, 0.12])));
        cue.current.inert = progress > 0.08;
      }
      if (copy.current) {
        copy.current.style.opacity = String(arrive);
        copy.current.style.transform = `translateY(${(1 - arrive) * 28}px)`;
        copy.current.inert = arrive < 0.5;
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
  }, []);

  const scrollOn = () => {
    const root = track.current;
    if (!root) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const top = window.scrollY + root.getBoundingClientRect().top;
    const span = root.offsetHeight - window.innerHeight;
    window.scrollTo({ top: reduced ? top + root.offsetHeight : top + span * 0.9, behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <>
      <div ref={track} className="h-[300vh] bg-black sm:h-[380vh] motion-reduce:h-auto">
        <div ref={stage} className="sticky top-0 h-svh overflow-hidden motion-reduce:static motion-reduce:h-auto motion-reduce:overflow-visible">
          <div aria-hidden className="portal-grain absolute inset-0 motion-reduce:min-h-svh" />
          <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgb(0_0_0/0.55)_78%,#000_100%)]" />

          <section className="dark absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center text-ink motion-reduce:relative motion-reduce:min-h-svh motion-reduce:py-32">
            <h1 ref={title} className="text-display max-w-[9em]">
              {hero.titleLine1}
            </h1>
            <div aria-hidden className="mt-10 flex h-11 items-center justify-center gap-7">
              <span ref={blue} className="portal-pulse size-11 rounded-full" style={{ background: BLUE, boxShadow: `0 0 22px ${BLUE}` }} />
              <span ref={cyan} className="portal-pulse size-11 rounded-full [animation-delay:-1.1s]" style={{ background: CYAN, boxShadow: `0 0 22px ${CYAN}` }} />
            </div>
            <button
              ref={cue}
              type="button"
              onClick={scrollOn}
              className="label mt-10 inline-flex items-center gap-2 text-white/55 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal"
            >
              Scroll
              <span className="softcom-nudge block">
                <ArrowDown className="size-4" />
              </span>
            </button>
          </section>

          <section
            ref={scene}
            aria-label={hero.titleLine2}
            className="pointer-events-none absolute inset-0 z-20 overflow-hidden opacity-0 motion-reduce:pointer-events-auto motion-reduce:relative motion-reduce:min-h-svh motion-reduce:opacity-100"
          >
            <div ref={world} className="absolute inset-0">
              <CmsImage image={hero.backgroundImage} file="home" path="hero.backgroundImage" priority className="object-cover" />
              <div ref={scrim} aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(0_0_0/0.62),rgb(0_0_0/0.28)_46%,transparent_72%)] opacity-0 motion-reduce:opacity-100" />
            </div>
            <div ref={copy} className="relative flex h-full flex-col items-center justify-end gap-6 px-6 pb-16 text-center text-white drop-shadow-[0_2px_18px_rgb(0_0_0/0.65)] sm:justify-center sm:pb-0">
              <h2 className="text-display max-w-[10em]">{hero.titleLine2}</h2>
              <p className="text-lede max-w-[34rem] text-white/85">{mission.text}</p>
              <PillLink href={mission.ctaHref} className="bg-white text-black hover:bg-signal">
                {mission.ctaLabel}
              </PillLink>
            </div>
          </section>
        </div>
      </div>

      <section className="container-site flex scroll-mt-24 flex-col items-start gap-8 pt-32 lg:pt-48">
        <p className="text-title max-w-[46rem] text-ink">{accentText(intro.text)}</p>
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <PillLink href={intro.primaryHref}>{intro.primaryLabel}</PillLink>
          <ArrowLink href={intro.secondaryHref}>{intro.secondaryLabel}</ArrowLink>
        </div>
      </section>
    </>
  );
}
