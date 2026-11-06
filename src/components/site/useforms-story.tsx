import { UseformsStoryClient } from "@/components/site/useforms-story-client";
import { USEFORMS_PAGE_HTML } from "@/components/site/useforms-page-html";
import "@/components/site/useforms-page.css";
import { getContent } from "@/lib/content";
import { applyCmsCaptions } from "@/lib/product-replica-captions";

/** Full Useforms product page replica of softcom-useforms.html. */
export async function UseformsStory() {
  const product = await getContent("products/useforms");
  const html = applyCmsCaptions(USEFORMS_PAGE_HTML, product);
  return <UseformsStoryClient html={html} />;
}
