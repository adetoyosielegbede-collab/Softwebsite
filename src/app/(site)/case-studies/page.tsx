import type { Metadata } from "next";
import { CaseList } from "@/components/case-list";
import { getSite } from "@/lib/content";

export const metadata: Metadata = { title: "Case studies" };

export default async function CaseStudiesPage() {
  const { caseStudies } = await getSite();
  return (
    <section className="px-6 pt-40 pb-20 md:px-12 md:pt-48">
      <p className="kicker">{caseStudies.kicker}</p>
      <h1 className="display mt-4 max-w-4xl text-[clamp(46px,7vw,90px)]">{caseStudies.headline}</h1>
      <p className="mt-6 max-w-2xl text-lg text-white/70">{caseStudies.lede}</p>
      <div className="mt-12">
        <CaseList items={caseStudies.items} />
      </div>
    </section>
  );
}
