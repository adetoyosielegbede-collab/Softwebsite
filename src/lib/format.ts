export function formatDate(iso: string): string {
  const monthOnly = /^(\d{4})-(\d{2})$/.test(iso);
  const d = new Date(`${monthOnly ? `${iso}-01` : iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    month: "long",
    ...(monthOnly ? {} : { day: "numeric" }),
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Insight dates are a month and a year, even when a day is stored. */
export function formatMonthYear(iso: string): string {
  const match = /^(\d{4})-(\d{2})/.exec(iso);
  if (!match) return formatDate(iso);
  const d = new Date(`${match[1]}-${match[2]}-01T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}
