import { CmsImage } from "@/components/cms/cms-image";
import { ArrowLink, PillLink } from "@/components/site/links";
import { isPartnerDiagram } from "@/components/site/partner-diagram-ids";
import { PartnerDiagram } from "@/components/site/partner-diagrams";
import { SentinelEnables } from "@/components/site/sentinel-enables";
import { SentinelEnablesStack } from "@/components/site/sentinel-enables-stack";
import { SentinelHeroVisual } from "@/components/site/sentinel-hero-visual";
import type { ProductContent, ProductFigure } from "@/lib/content-types";
import { cn } from "@/lib/utils";

function isScreen(fig: ProductFigure) {
  return fig.source.startsWith("Product screen") || fig.image.src.includes("/screen-");
}

function FigurePlate({
  fig,
  file,
  path,
  priority,
  wide,
}: {
  fig: ProductFigure;
  file: string;
  path: string;
  priority?: boolean;
  /** Diagrams read left to right, so they take the full measure. Screens stay near their native width. */
  wide?: boolean;
}) {
  const screen = isScreen(fig);
  const drawn = isPartnerDiagram(fig.diagram);

  if (drawn) {
    return (
      <figure className="m-0">
        <PartnerDiagram id={fig.diagram!} />
        <figcaption className="sr-only">
          {fig.label}. {fig.title}. {fig.caption}
        </figcaption>
      </figure>
    );
  }

  const awaitingImage = !fig.image?.src;

  return (
    <figure className={cn("m-0", !wide && screen && "lg:max-w-[920px]")}>
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.25rem]",
          screen ? "bg-white p-1.5 ring-1 ring-black/10 sm:p-2" : "bg-surface ring-1 ring-line",
        )}
      >
        {awaitingImage ? (
          <div className="flex min-h-52 w-full flex-col items-center justify-center gap-2 px-6 py-16 text-center">
            <p className="label text-ink-faint">Illustrative visual</p>
            <p className="max-w-md text-sm text-ink-soft">
              {fig.caption || "Final image to follow."}
            </p>
          </div>
        ) : null}
        <CmsImage
          image={fig.image}
          file={file}
          path={path}
          priority={priority}
          fluid
          emptyClassName={cn("min-h-40 w-full", awaitingImage && "absolute inset-0 min-h-full")}
        />
      </div>
      {fig.label || fig.title || (fig.caption && !awaitingImage) ? (
        <figcaption className="mt-4 flex flex-col gap-1 sm:max-w-3xl">
          {fig.label || fig.title ? (
            <p className="text-sm text-ink">
              {fig.label ? (
                <>
                  <span className="label text-ink-faint">{fig.label}</span>
                  <span className="mx-2 text-ink-faint" aria-hidden>
                    ·
                  </span>
                </>
              ) : null}
              {fig.title}
            </p>
          ) : null}
          {fig.caption && !awaitingImage ? <p className="text-sm text-ink-soft">{fig.caption}</p> : null}
          {fig.source ? <p className="text-sm text-ink-faint">{fig.source}</p> : null}
        </figcaption>
      ) : null}
    </figure>
  );
}

function ChapterCopy({
  number,
  title,
  text,
  tags,
}: {
  number?: string;
  title: string;
  text?: string;
  tags?: string[];
}) {
  return (
    <header>
      {number ? <p className="label text-signal">{number}</p> : null}
      <h2 className={cn("text-headline max-w-[18ch] text-balance", number && "mt-4")}>{title}</h2>
      {text ? <p className="text-lede mt-5 max-w-xl leading-[1.45] text-ink-soft">{text}</p> : null}
      {tags && tags.length > 0 ? (
        <ul className="mt-7 flex flex-wrap gap-2" aria-label="Examples of activity to examine">
          {tags.map((tag) => (
            <li
              key={tag}
              className="rounded-[3px] border border-line bg-white px-2.5 py-2 text-xs font-bold text-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}

function CaseFrame({
  frame,
}: {
  frame: NonNullable<ProductContent["caseFrame"]>;
}) {
  return (
    <div id="the-case" className="scroll-mt-28 border-t border-line bg-surface/60">
      <div className="container-site flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:py-7">
        <p className="label text-ink-soft">
          <span className="uppercase tracking-[0.08em]">{frame.label}</span>
          <span className="mx-2 text-ink-faint" aria-hidden>
            ·
          </span>
          <span className="text-ink">{frame.id}</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-ink-soft">
          {frame.steps.map((step, i) => (
            <span key={step} className="inline-flex items-center gap-2">
              {i > 0 ? (
                <span className="text-ink-faint" aria-hidden>
                  →
                </span>
              ) : null}
              <span>{step}</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export function ProductStory({ product, file }: { product: ProductContent; file: string }) {
  const { hero } = product;
  const heroLayers = hero.visual === "sentinel-layers";
  const heroBlock = product.blocks.findIndex((block) => !block.title && block.figures.length > 0);
  const heroFigures = !heroLayers && heroBlock >= 0 ? product.blocks[heroBlock].figures : [];
  const heroMedia = heroLayers || heroFigures.length > 0;
  const caseFrame = product.caseFrame;

  return (
    <>
      <section className="container-site pt-28 pb-10 md:pt-36 md:pb-14">
        <div
          className={cn(
            heroMedia && "grid items-center gap-10 lg:grid-cols-12 lg:gap-x-14",
          )}
        >
          <div
            className={cn(
              heroLayers && "hero-copy lg:col-span-6",
              !heroLayers && heroFigures.length > 0 && "lg:col-span-5",
            )}
          >
            {hero.logo?.src ? (
              <CmsImage
                image={hero.logo}
                file={file}
                path="hero.logo"
                fluid
                className={cn(
                  "mb-6 w-auto",
                  hero.logo.src.includes("useforms-logo") ? "h-8" : "h-14",
                  (/\/(sentinel|reckon)-logo\.png$/.test(hero.logo.src) ||
                    hero.logo.src.includes("useforms-logo-white")) &&
                    "light:brightness-0",
                )}
              />
            ) : null}
            {hero.eyebrow ? <p className="label text-ink-soft">{hero.eyebrow}</p> : null}
            <h1
              className={cn(
                "text-display max-w-4xl whitespace-pre-line text-balance",
                hero.eyebrow ? "mt-5" : hero.logo?.src ? "mt-0" : null,
              )}
            >
              {hero.title}
            </h1>
            <div className="mt-6 flex max-w-xl flex-col gap-4">
              {hero.text ? <p className="text-lede leading-[1.45] text-ink-soft">{hero.text}</p> : null}
              {product.overview.map((paragraph) => (
                <p key={paragraph} className="text-lede leading-[1.45] text-ink-soft">
                  {paragraph}
                </p>
              ))}
            </div>
            {(hero.primaryLabel || hero.secondaryLabel) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
                {hero.primaryLabel ? <PillLink href={hero.primaryHref}>{hero.primaryLabel}</PillLink> : null}
                {hero.secondaryLabel ? <ArrowLink href={hero.secondaryHref}>{hero.secondaryLabel}</ArrowLink> : null}
              </div>
            )}
          </div>
          {heroLayers ? (
            <div className="hero-vis flex flex-col gap-10 lg:col-span-6">
              <SentinelHeroVisual />
            </div>
          ) : heroFigures.length > 0 ? (
            <div className="flex flex-col gap-10 lg:col-span-7">
              {heroFigures.map((fig, f) => (
                <FigurePlate
                  key={fig.label || fig.title || f}
                  fig={fig}
                  file={file}
                  path={`blocks.${heroBlock}.figures.${f}.image`}
                  priority={f === 0}
                />
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <div id="overview" className="scroll-mt-24">
        {product.blocks.map((block, b) => {
          if (!block.title) return null;
          const split = block.layout === "split" || block.layout === "split-reverse";
          const reverse = block.layout === "split-reverse";
          const beside =
            block.figures[0] && (split || isScreen(block.figures[0])) ? block.figures[0] : null;
          const stacked = beside ? block.figures.slice(1) : block.figures;
          const showCaseFrame = caseFrame && caseFrame.beforeBlock === b;

          if (block.feature === "sentinel-enables" || block.feature === "sentinel-enables-stack") {
            return (
              <div key={`${block.number}-${b}`}>
                {showCaseFrame ? <CaseFrame frame={caseFrame} /> : null}
                <div id={`chapter-${b}`} className="scroll-mt-28 border-t border-line">
                  {block.feature === "sentinel-enables" ? <SentinelEnables /> : <SentinelEnablesStack />}
                </div>
              </div>
            );
          }

          return (
            <div key={`${block.number}-${b}`}>
              {showCaseFrame ? <CaseFrame frame={caseFrame} /> : null}
              <section
                id={`chapter-${b}`}
                className={cn(
                  "scroll-mt-28 border-t border-line",
                  reverse && "bg-surface/50",
                )}
              >
                <div className="container-site py-16 md:py-24 lg:py-28">
                  {block.points.length > 0 && block.figures.length === 0 ? (
                    <>
                      <ChapterCopy number={block.number} title={block.title} text={block.text} tags={block.tags} />
                      <ul className="mt-12 grid gap-4 md:grid-cols-3">
                        {block.points.map((point, p) => (
                          <li key={point.title} className="flex flex-col gap-3 rounded-2xl bg-surface p-6 ring-1 ring-line md:p-8">
                            <span className="label text-ink-faint">0{p + 1}</span>
                            <h3 className="text-title text-[1.35rem]">{point.title}</h3>
                            <p className="text-body leading-[1.45] text-ink-soft">{point.text}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <>
                      {beside ? (
                        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-16">
                          <div className={cn("lg:col-span-5", reverse && "lg:order-2")}>
                            <ChapterCopy
                              number={block.number}
                              title={block.title}
                              text={block.text}
                              tags={block.tags}
                            />
                          </div>
                          <div className={cn("lg:col-span-7", reverse && "lg:order-1")}>
                            <FigurePlate fig={beside} file={file} path={`blocks.${b}.figures.0.image`} />
                          </div>
                        </div>
                      ) : (
                        <ChapterCopy
                          number={block.number}
                          title={block.title}
                          text={block.text}
                          tags={block.tags}
                        />
                      )}
                      {stacked.length > 0 && (
                        <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:gap-16">
                          {stacked.map((fig, i) => {
                            const f = beside ? i + 1 : i;
                            return (
                              <FigurePlate
                                key={fig.label || fig.title || f}
                                fig={fig}
                                file={file}
                                path={`blocks.${b}.figures.${f}.image`}
                                wide={!isScreen(fig)}
                              />
                            );
                          })}
                        </div>
                      )}
                      {block.points.length > 0 && (
                        <ul className="mt-12 grid gap-4 md:grid-cols-3">
                          {block.points.map((point) => (
                            <li key={point.title} className="rounded-2xl bg-surface p-6 ring-1 ring-line">
                              <h3 className="text-title text-[1.35rem]">{point.title}</h3>
                              <p className="text-body mt-3 leading-[1.45] text-ink-soft">{point.text}</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  )}
                </div>
              </section>
            </div>
          );
        })}
      </div>

      {product.band?.title ? (
        <section className="bg-[#10172a] text-white">
          <div className="container-site flex flex-col gap-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8 md:py-[43px]">
            <p className="max-w-[22ch] whitespace-pre-line text-[1.5rem] leading-[1.35] tracking-[-0.02em] text-balance">
              {product.band.title}
            </p>
            <p className="max-w-[420px] text-[15px] leading-[1.5] text-[#b7c5dc]">{product.band.text}</p>
          </div>
        </section>
      ) : null}

      {product.closePair?.panels.length ? (
        <section className="border-t border-line">
          <div className="container-site py-16 md:py-24 lg:py-28">
            <div className="grid gap-4 md:grid-cols-2 md:items-stretch">
              {product.closePair.panels.map((panel) => (
                <article key={panel.title} className="flex h-full flex-col rounded-3xl bg-surface p-6 lg:p-8">
                  <h2 className="text-title flex min-h-[calc(2*1.15em)] max-w-[20ch] items-end text-balance leading-[1.15]">
                    {panel.title}
                  </h2>
                  <p className="text-body mt-5 flex-1 leading-[1.45] text-ink-soft">{panel.text}</p>
                </article>
              ))}
            </div>
            {(product.audience.closing || product.audience.ctaLabel) && (
              <div className="mt-8 flex flex-col items-center gap-5 text-center sm:mt-10">
                {product.audience.closing ? (
                  <p className="text-lede max-w-2xl leading-[1.45] text-ink-soft">{product.audience.closing}</p>
                ) : null}
                {product.audience.ctaLabel ? (
                  <PillLink href={product.audience.ctaHref ?? "/contact"}>{product.audience.ctaLabel}</PillLink>
                ) : null}
              </div>
            )}
          </div>
        </section>
      ) : product.audience.title ? (
        <section className="border-t border-line">
          <div className="container-site py-16 md:py-24 lg:py-28">
            {product.audience.eyebrow ? <p className="label text-ink-soft">{product.audience.eyebrow}</p> : null}
            <h2 className="text-headline mt-4 max-w-[18ch] text-balance">{product.audience.title}</h2>
            {product.audience.text ? (
              <p className="text-lede mt-6 max-w-2xl leading-[1.45] text-ink-soft">{product.audience.text}</p>
            ) : null}
            {product.audience.closing ? (
              <p className="text-lede mt-4 max-w-2xl leading-[1.45] text-ink-soft">{product.audience.closing}</p>
            ) : null}
            {product.audience.ctaLabel ? (
              <div className="mt-8">
                <PillLink href={product.audience.ctaHref ?? "/contact"}>{product.audience.ctaLabel}</PillLink>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {product.references?.links.length ? (
        <section className="border-t border-line">
          <div className="container-site py-12 md:py-16">
            <p className="label text-ink-soft">{product.references.title}</p>
            <ul className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-3">
              {product.references.links.map((link) => (
                <li key={link.href + link.label}>
                  <ArrowLink href={link.href}>{link.label}</ArrowLink>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
