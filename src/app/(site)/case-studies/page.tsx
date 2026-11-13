import type { Metadata } from "next";
import { CaseStudiesScreen } from "@/components/site/case-studies-screen";
import { getContent, requirePublishedPage } from "@/lib/content";
import { publicPageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  await requirePublishedPage("case-studies");
  const page = await getContent("case-studies");
  return publicPageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: "/case-studies",
    image: page.band.src ? page.band : page.cta.image,
  });
}

export default function CaseStudiesPage() {
  return <CaseStudiesScreen />;
}
