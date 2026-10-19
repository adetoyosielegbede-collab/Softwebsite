import { EditOverlay } from "@/components/cms/edit-overlay";
import { PageTransition } from "@/components/site/page-transition";
import { RevealProvider } from "@/components/site/reveal-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getContent } from "@/lib/content";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const site = await getContent("site");
  return (
    <>
      <SiteHeader site={site} />
      <main id="main">
        {children}
        <SiteFooter site={site} />
      </main>
      <RevealProvider />
      <PageTransition />
      <EditOverlay />
    </>
  );
}
