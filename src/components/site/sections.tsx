import Image from "next/image";
import { CmsImage } from "@/components/cms/cms-image";
import type { Cta, SiteContent } from "@/lib/content-types";
import type { CmsImage as CmsImageValue } from "@/lib/cms/paths";
import { cn } from "@/lib/utils";
import { ColorReveal } from "./color-reveal";
import { CountUp } from "./count-up";
import { HeroBits } from "./dot-canvas";
import { LineReveal } from "./line-reveal";
import { ArrowLink, PillLink } from "./links";

type HeroProps = {
  file: string;
  path?: string;
  eyebrow?: string;
  title: string;
  text?: string;
  backgroundImage?: CmsImageValue;
  actions?: { label: string; href: string; variant?: "pill" | "arrow" }[];
  /** Paint the title immediately. Above-the-fold heroes use this so the line is never clipped. */
  immediateTitle?: boolean;
};

export function PageHero({ file, path = "hero", eyebrow, title, text, backgroundImage, actions = [], immediateTitle = false }: HeroProps) {
  const hasImage = Boolean(backgroundImage?.src);
  const titleClass = `text-display ${cn("mx-auto max-w-[18ch] text-balance", eyebrow && "mt-6", hasImage && "text-white")}`;
  return (
    <section className="relative isolate flex min-h-[80svh] flex-col pt-32 md:pt-44">
      {hasImage ? (
        <>
          <ColorReveal className="absolute inset-0">
            <CmsImage image={backgroundImage} file={file} path={`${path}.backgroundImage`} priority />
          </ColorReveal>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-paper" />
        </>
      ) : (
        <>
          <HeroBits />
          <CmsImage
            image={backgroundImage}
            file={file}
            path={`${path}.backgroundImage`}
            emptyClassName="absolute top-24 right-6 z-10"
          />
        </>
      )}
      <div className={cn("container-site relative flex flex-1 flex-col items-center justify-center text-center", hasImage && "text-white")}>
        {eyebrow && (
          <p className={cn("label", hasImage ? "text-white/70" : "text-ink-soft")} data-reveal>
            {eyebrow}
          </p>
        )}
        {immediateTitle ? (
          <h1 className={titleClass}>{title}</h1>
        ) : (
          <LineReveal as="h1" immediate delay={0.15} className={titleClass}>
            {title}
          </LineReveal>
        )}
        {text && (
          <p
            className={cn("mx-auto mt-6 max-w-xl text-lg text-pretty", hasImage ? "text-white/80" : "text-ink-soft")}
            data-reveal
            style={{ "--reveal-delay": "400ms" } as React.CSSProperties}
          >
            {text}
          </p>
        )}
        {actions.some((a) => a.label) && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-5" data-reveal style={{ "--reveal-delay": "550ms" } as React.CSSProperties}>
            {actions.map((a) =>
              a.variant === "arrow" ? (
                <ArrowLink key={a.label} href={a.href} className={hasImage ? "text-white hover:text-signal" : undefined}>
                  {a.label}
                </ArrowLink>
              ) : (
                <PillLink key={a.label} href={a.href} className={hasImage ? "bg-white text-black hover:bg-signal" : undefined}>
                  {a.label}
                </PillLink>
              ),
            )}
          </div>
        )}
      </div>
      <div className="mt-20 md:mt-28">
        <FrameMarks />
      </div>
    </section>
  );
}

export function CtaBanner({ cta, file, path = "cta", className }: { cta: Cta; file: string; path?: string; className?: string }) {
  const split = cta.layout === "split";
  return (
    <section
      className={cn(
        "dark sticky top-0 z-0 relative mx-4 mt-16 flex h-[min(420px,70svh)] flex-col items-center justify-center overflow-hidden rounded-[2rem] px-6 text-white md:mx-10 lg:mt-24 lg:h-[min(520px,70svh)]",
        className,
      )}
      data-reveal
    >
        <CmsImage image={cta.image} file={file} path={`${path}.image`} sizes="(min-width: 1440px) 1360px, 100vw" />
        <div className="absolute inset-0 -z-0 bg-black/75" />
        <div
          className={cn(
            "relative z-10 mx-auto flex w-full max-w-5xl flex-col gap-6",
            split ? "lg:flex-row lg:items-center lg:justify-between" : "items-center text-center",
          )}
        >
          <div className={cn("flex flex-col gap-6", split ? "max-w-md" : "items-center")}>
            <span className="size-4 rounded-full bg-signal shadow-[0_0_30px_rgba(0,255,255,0.7)]" aria-hidden />
            <h2 className="text-headline max-w-[598px] text-center">{cta.title}</h2>
          </div>
          <div className={cn("flex flex-col gap-6", split ? "max-w-sm" : "items-center")}>
            {cta.text && <p className="text-lede max-w-[576px] text-center text-ink-soft">{cta.text}</p>}
            <div>
              <PillLink href={cta.ctaHref}>{cta.ctaLabel}</PillLink>
            </div>
          </div>
        </div>
    </section>
  );
}

export function Stats({ stats, count = false }: { stats: SiteContent["stats"]; count?: boolean }) {
  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 lg:grid-cols-4">
      {stats.map((s, i) => (
        <div key={s.label} data-reveal style={{ "--reveal-delay": `${i * 80}ms` } as React.CSSProperties}>
          <dd className="font-heading text-5xl leading-[0.9] font-light lg:text-7xl">
            {count ? <CountUp value={s.value} delay={i * 120} /> : s.value}
          </dd>
          <dt className="text-body text-ink-soft">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

export function PartnerMarquee({ partners }: { partners: SiteContent["partners"] }) {
  const row = (hidden: boolean) =>
    partners.map((p, i) => (
      <li key={`${p.name}-${hidden}`} aria-hidden={hidden || undefined} className="flex shrink-0 items-center">
        {p.logo.src && (
          <Image
            src={p.logo.src}
            alt={hidden ? "" : p.logo.alt || p.name}
            title={p.name}
            width={p.width}
            height={p.height}
            unoptimized={p.logo.src.endsWith(".svg")}
            data-cms-file={hidden ? undefined : "site"}
            data-cms-path={hidden ? undefined : `partners.${i}.logo`}
            className="block object-contain opacity-55 brightness-0 transition-opacity hover:opacity-100 dark:invert"
            style={{ width: p.width, height: p.height }}
          />
        )}
      </li>
    ));
  return (
    <div className="relative overflow-hidden py-3 [mask-image:linear-gradient(90deg,transparent,#000_10%,#000_90%,transparent)]">
      <ul className="flex w-max animate-marquee items-center gap-16 pr-16 hover:[animation-play-state:paused] lg:gap-24 lg:pr-24">
        {row(false)}
        {row(true)}
      </ul>
    </div>
  );
}

export function SectionNumber({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-xs text-ink-soft">{children}</p>;
}

/** Registration crosses that sit on the top edge of a homepage section. */
export function FrameMarks() {
  return (
    <div aria-hidden className="container-site pointer-events-none relative h-5">
      <svg viewBox="0 0 20 20" className="absolute top-0 left-0 size-5 text-line-strong">
        <path d="M0.5 0v20M0 10h10" stroke="currentColor" />
      </svg>
      <svg viewBox="0 0 20 20" className="absolute top-0 left-1/2 hidden size-5 -translate-x-1/2 text-line-strong md:block">
        <path d="M10 0v20M0 10h20" stroke="currentColor" />
      </svg>
      <svg viewBox="0 0 20 20" className="absolute top-0 right-0 size-5 text-line-strong">
        <path d="M19.5 0v20M10 10h10" stroke="currentColor" />
      </svg>
    </div>
  );
}
