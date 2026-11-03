export const PARTNER_DIAGRAM_IDS = [
  "liquio-foundation",
  "liquio-journey",
  "rtgs-network",
  "rtgs-settlement",
  "sentinel-connections",
] as const;

export type PartnerDiagramId = (typeof PARTNER_DIAGRAM_IDS)[number];

export function isPartnerDiagram(id: string | undefined): id is PartnerDiagramId {
  return !!id && (PARTNER_DIAGRAM_IDS as readonly string[]).includes(id);
}
