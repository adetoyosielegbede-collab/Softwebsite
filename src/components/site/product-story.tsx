import { CmsImage } from "@/components/cms/cms-image";
import { ArrowLink, PillLink } from "@/components/site/links";
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
  return (
    <figure className={cn("m-0", !wide && screen && "lg:max-w-[920px]")}>
      <div
        className={cn(
          "overflow-hidden rounded-[1.25rem]",
          screen ? "bg-white p-1.5 ring-1 ring-black/10 sm:p-2" : "bg-surface ring-1 ring-line",
        )}
      >
        <CmsImage image={fig.image} file={file} path={path} priority={priority} fluid emptyClassName="min-h-40 w-full" />
      </div>
      <figcaption className="mt-4 flex flex-col gap-1 sm:max-w-3xl">
        <p className="text-sm text-ink">
          <span className="label text-ink-faint">{fig.label}</span>
          <span className="mx-2 text-ink-faint" aria-hidden>
            ·
          </span>
          {fig.title}
        </p>
        {fig.caption ? <p className="text-sm text-ink-soft">{fig.caption}</p> : null}
      </figcaption>
    </figure>
  );
}

function ChapterCopy({ number, title, text }: { number?: string; title: string; text?: string }) {
  return (
    <header>
      {number ? <p className="label text-signal">{number}</p> : null}
      <h2 className={cn("text-headline max-w-[18ch] text-balance", number && "mt-4")}>{title}</h2>
      {text ? <p className="text-lede mt-5 max-w-xl leading-[1.45] text-ink-soft">{text}</p> : null}
    </header>
  );
}

export function ProductStory({ product, file }: { product: ProductContent; file: string }) {
  const { hero } = product;
  const heroBlock = product.blocks.findIndex((block) => !block.title && block.figures.length > 0);
  const heroFigures = heroBlock >= 0 ? product.blocks[heroBlock].figures : [];

  return (
    <>
      <section className="container-site pt-28 pb-4 md:pt-36">
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
        <h1 className={cn("text-display max-w-4xl text-balance", hero.eyebrow && "mt-5")}>{hero.title}</h1>
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
      </section>

      {heroFigures.length > 0 && (
        <div className="container-site flex flex-col gap-12 pt-10 pb-6 lg:pt-14">
          {heroFigures.map((fig, f) => (
            <FigurePlate
              key={fig.label}
              fig={fig}
              file={file}
              path={`blocks.${heroBlock}.figures.${f}.image`}
              priority={f === 0}
            />
          ))}
        </div>
      )}

      <div id="overview" className="scroll-mt-24">
        {product.blocks.map((block, b) => {
          if (!block.title) return null;
          const beside = block.figures[0] && isScreen(block.figures[0]) ? block.figures[0] : null;
          const stacked = beside ? block.figures.slice(1) : block.figures;

          return (
            <section key={`${block.number}-${b}`} id={`chapter-${b}`} className="scroll-mt-28 border-t border-line">
              <div className="container-site py-16 md:py-24 lg:py-28">
                {block.points.length > 0 && block.figures.length === 0 ? (
                  <>
                    <ChapterCopy number={block.number} title={block.title} text={block.text} />
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
                        <div className="lg:col-span-5">
                          <ChapterCopy number={block.number} title={block.title} text={block.text} />
                        </div>
                        <div className="lg:col-span-7">
                          <FigurePlate fig={beside} file={file} path={`blocks.${b}.figures.0.image`} />
                        </div>
                      </div>
                    ) : (
                      <ChapterCopy number={block.number} title={block.title} text={block.text} />
                    )}
                    {stacked.length > 0 && (
                      <div className="mt-10 flex flex-col gap-12 lg:mt-14 lg:gap-16">
                        {stacked.map((fig, i) => {
                          const f = beside ? i + 1 : i;
                          return (
                            <FigurePlate
                              key={fig.label}
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
          );
        })}
      </div>

      {product.audience.title && (
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
      )}
    </>
  );
}
