import type { Metadata } from "next";
import { CmsImage } from "@/components/cms/cms-image";
import { AlumniForm } from "@/components/site/alumni-form";
import { PillLink } from "@/components/site/links";
import { getContent } from "@/lib/content";

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = await getContent("alumni");
  return { title: seo.title, description: seo.description };
}

export default async function AlumniPage() {
  const page = await getContent("alumni");
  const { hero, join } = page;

  return (
    <>
      <section className="relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-0 pt-24 pb-20 text-center md:pt-28 md:pb-28">
        <div className="absolute inset-0">
          <CmsImage
            image={hero.backgroundImage}
            file="alumni"
            path="hero.backgroundImage"
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div aria-hidden className="absolute inset-0 bg-black/45" />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/55" />
        <div className="container-site relative z-10 -translate-y-6 text-white md:-translate-y-10">
          <div className="mx-auto flex max-w-2xl flex-col items-center">
            <h1 className="text-display text-balance">{hero.title}</h1>
            <p className="text-body mt-6 text-white/90">{hero.subtext}</p>
            <div className="text-body mt-6 flex flex-col gap-4 text-white/80">
              {hero.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <div className="mt-10">
              <PillLink href={hero.ctaHref} className="bg-white text-black hover:bg-signal">
                {hero.ctaLabel}
              </PillLink>
            </div>
          </div>
        </div>
      </section>

      <section id="join" className="container-site scroll-mt-28 grid gap-10 pt-24 pb-8 lg:grid-cols-12 lg:gap-x-6 lg:pt-32">
        <div className="lg:col-span-4">
          <h2 className="text-headline text-balance">{join.title}</h2>
          <p className="text-body mt-5 text-ink-soft">{join.text}</p>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <AlumniForm form={join} />
        </div>
      </section>
    </>
  );
}
