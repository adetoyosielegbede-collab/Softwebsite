import type { ProductContent, ProductFigure } from "@/lib/content-types";

/** Figures in CMS block order — matches left-to-right / top-to-bottom figcaptions on replica pages. */
export function flattenProductFigures(product: ProductContent): ProductFigure[] {
  return product.blocks.flatMap((block) => block.figures ?? []);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function figcaptionHtml(fig: ProductFigure): string {
  const label = escapeHtml(fig.label ?? "");
  const title = escapeHtml(fig.title ?? "");
  const caption = escapeHtml(fig.caption ?? "");
  return `<figcaption><p class="cap-t"><span class="label">${label}</span>${title}</p><p class="cap-s">${caption}</p></figcaption>`;
}

/**
 * Replace each `<figcaption>` in a static product-page replica with CMS
 * label / title / caption values, in document order.
 */
export function applyCmsCaptions(html: string, product: ProductContent): string {
  const figures = flattenProductFigures(product);
  let index = 0;
  return html.replace(/<figcaption>[\s\S]*?<\/figcaption>/g, (match) => {
    const fig = figures[index++];
    return fig ? figcaptionHtml(fig) : match;
  });
}
