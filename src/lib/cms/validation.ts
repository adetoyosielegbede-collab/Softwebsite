/** Max length for an insight article title in the CMS and on the homepage pair. */
export const POST_TITLE_MAX = 56;

export function assertPostTitleLimit(data: unknown) {
  const items = (data as { items?: { title?: unknown }[] }).items;
  if (!Array.isArray(items)) return;
  for (const [index, item] of items.entries()) {
    const title = item?.title;
    if (typeof title !== "string") continue;
    if (title.length > POST_TITLE_MAX) {
      throw new Error(
        `Insight title #${index + 1} is ${title.length} characters. Keep titles to ${POST_TITLE_MAX} characters or fewer.`,
      );
    }
  }
}

export function isPostTitlePath(path: string) {
  return /^items\.\d+\.title$/.test(path);
}
