export type ContentFile = {
  id: string;
  label: string;
  group: "Site-wide" | "Pages" | "Products" | "Collections";
  href?: string;
};

export const CONTENT_FILES: ContentFile[] = [
  { id: "site", label: "Header, footer & shared", group: "Site-wide", href: "/" },
  { id: "home", label: "Home", group: "Pages", href: "/" },
  { id: "about", label: "About", group: "Pages", href: "/about" },
  { id: "solutions", label: "Solutions", group: "Pages", href: "/solutions" },
  { id: "enterprise-products", label: "Enterprise Products", group: "Pages", href: "/enterprise-products" },
  { id: "case-studies", label: "Case Studies", group: "Pages", href: "/case-studies" },
  { id: "insights", label: "Insights", group: "Pages", href: "/insights" },
  { id: "careers", label: "Careers", group: "Pages", href: "/careers" },
  { id: "contact", label: "Contact", group: "Pages", href: "/contact" },
  { id: "products/lift", label: "Lift", group: "Products", href: "/enterprise-products/lift" },
  { id: "products/reckon", label: "Reckon", group: "Products", href: "/enterprise-products/reckon" },
  { id: "products/sentinel", label: "Sentinel", group: "Products", href: "/enterprise-products/sentinel" },
  { id: "products/useforms", label: "Useforms", group: "Products", href: "/enterprise-products/useforms" },
  { id: "posts", label: "Insight articles", group: "Collections", href: "/insights" },
];

export const PRODUCT_SLUGS = ["lift", "reckon", "sentinel", "useforms"] as const;

export function isContentFile(id: string): boolean {
  return CONTENT_FILES.some((f) => f.id === id);
}

export function getContentFile(id: string): ContentFile | undefined {
  return CONTENT_FILES.find((f) => f.id === id);
}
