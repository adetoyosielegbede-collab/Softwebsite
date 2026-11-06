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

/**
 * Escape CMS text for HTML. Leading spaces become non-breaking so an indent
 * typed in the CMS is preserved (normal HTML whitespace would collapse them).
 */
function escapeCmsText(value: string): string {
  const match = value.match(/^([ \t\u00a0]*)([\s\S]*)$/);
  const leading = (match?.[1] ?? "").replace(/ |\t|\u00a0/g, "&nbsp;");
  return leading + escapeHtml(match?.[2] ?? "");
}

function figcaptionHtml(fig: ProductFigure): string {
  const label = (fig.label ?? "").trimEnd();
  const title = fig.title ?? "";
  const caption = fig.caption ?? "";
  const hasLabel = label.trim().length > 0;
  const hasTitle = title.trim().length > 0;
  const hasCaption = caption.trim().length > 0;

  const parts: string[] = [];
  if (hasLabel || hasTitle) {
    const labelHtml = hasLabel
      ? `<span class="label">${escapeCmsText(label.trim())}</span>`
      : "";
    // Keep intentional leading spaces on the title when the label is cleared.
    const titleHtml = hasTitle ? escapeCmsText(hasLabel ? title.trimStart() : title) : "";
    parts.push(`<p class="cap-t">${labelHtml}${titleHtml}</p>`);
  }
  if (hasCaption) {
    parts.push(`<p class="cap-s">${escapeCmsText(caption)}</p>`);
  }
  if (parts.length === 0) return "";
  return `<figcaption>${parts.join("")}</figcaption>`;
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
