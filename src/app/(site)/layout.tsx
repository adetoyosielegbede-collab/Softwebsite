import { CmsEditingProvider } from "@/components/cms/cms-editing";
import { EditOverlay } from "@/components/cms/edit-overlay";
import { isAuthenticated } from "@/lib/cms/auth";
import { JsonLd } from "@/components/site/json-ld";
import { PageTransition } from "@/components/site/page-transition";
import { RevealProvider } from "@/components/site/reveal-provider";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicSite } from "@/lib/content";
import { siteStructuredData } from "@/lib/seo";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [site, editing] = await Promise.all([getPublicSite(), isAuthenticated()]);
  return (
    <CmsEditingProvider enabled={editing}>
      <JsonLd data={siteStructuredData(site)} />
      <SiteHeader site={site} />
      <main id="main">
        {children}
        <SiteFooter site={site} />
      </main>
      <RevealProvider />
      <PageTransition />
      {editing ? <EditOverlay /> : null}
    </CmsEditingProvider>
  );
}
