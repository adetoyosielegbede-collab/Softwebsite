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
