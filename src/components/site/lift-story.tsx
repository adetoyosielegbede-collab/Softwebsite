import { LIFT_PAGE_HTML } from "@/components/site/lift-page-html";
import "@/components/site/lift-page.css";
import { getContent } from "@/lib/content";
import { applyCmsCaptions } from "@/lib/product-replica-captions";

/** Full Lift product page replica of softcom-lift.html (diagrams + screens). */
export async function LiftStory() {
  const product = await getContent("products/lift");
  const html = applyCmsCaptions(LIFT_PAGE_HTML, product);

  return (
    <div
      className="lift-page"
      // Static markup from the Softcom Lift HTML brief; captions come from the CMS.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
