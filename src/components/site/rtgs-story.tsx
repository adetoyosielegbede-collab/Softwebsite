import { RTGS_PAGE_HTML } from "@/components/site/rtgs-page-html";
import "@/components/site/rtgs-page.css";
import { getContent } from "@/lib/content";
import { applyCmsCaptions } from "@/lib/product-replica-captions";

/** Full RTGS.global product page replica of softcom-rtgs-global2.html. */
export async function RtgsStory() {
  const product = await getContent("products/rtgs-global");
  const html = applyCmsCaptions(RTGS_PAGE_HTML, product);

  return (
    <div
      className="rtgs-page"
      // Static markup from the Softcom RTGS.global HTML brief; captions come from the CMS.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
