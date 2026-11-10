import { LIQUIO_PAGE_HTML } from "@/components/site/liquio-page-html";
import "@/components/site/liquio-page.css";
import { LiquioStoryClient } from "@/components/site/liquio-story-client";
import { getContent } from "@/lib/content";
import { applyCmsCaptions } from "@/lib/product-replica-captions";

/** Full Liquio product page replica of softcom-liquio2.html. */
export async function LiquioStory() {
  const product = await getContent("products/liquio");
  const html = applyCmsCaptions(LIQUIO_PAGE_HTML, product);
  return <LiquioStoryClient html={html} />;
}
