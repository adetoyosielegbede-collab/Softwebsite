import type { FontSize, TextStyleLabel, Typography } from "@/lib/typography";
import type { CmsImage } from "@/lib/cms/paths";

export type { CmsImage };

export type Link = { label: string; href: string };

export type Seo = { title: string; description: string };

export type Cta = {
  image: CmsImage;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  layout: "center" | "split";
};

export type Hero = {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaHref: string;
  backgroundImage: CmsImage;
};

export type SiteContent = {
  brand: { name: string; logo: CmsImage; tagline: string };
  contact: { email: string; company: string; addressLines: string[] };
  menu: { title: string; links: Link[] }[];
  headerNav: { label: string; href: string; links?: Link[] }[];
  menuFeature: { eyebrow: string; title: string; image: CmsImage; ctaLabel: string; ctaHref: string };
  footer: { eyebrow: string; copyright: string };
  stats: { value: string; label: string }[];
  partners: { name: string; logo: CmsImage; width: number; height: number }[];
  seo: { title: string; description: string; shareImage: CmsImage };
  typography?: Partial<Typography>;
};

export type HomeContent = {
  hero: { titleLine1: string; titleLine2: string; imageMode?: boolean; backgroundImage: CmsImage };
  intro: { text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  mission: { image: CmsImage; title: string; text: string; ctaLabel: string; ctaHref: string };
  focusAreas: {
    title: string;
    items: { number: string; title: string; text: string; ctaLabel: string; href: string; image: CmsImage }[];
  };
  audiences: {
    title: string;
    intro: string;
    items: { title: string; text: string; tags: string[]; icon: CmsImage }[];
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  howWeWork: { eyebrow: string; items: { label: string; title: string; text: string }[]; ctaLabel: string; ctaHref: string };
  thinking: { title: string; text: string; ctaLabel: string; ctaHref: string };
  cta: Cta;
};

export type AboutContent = {
  seo: Seo;
  hero: Hero;
  story: { title: string; paragraphs: string[]; image: CmsImage };
  journey: { eyebrow: string; title: string; range: string; items: { year: string; title: string; text: string; image: CmsImage }[] };
  values: { title: string; items: { title: string; text: string }[] };
  leadership: { title: string; grayscale: boolean; people: { name: string; role: string; photo: CmsImage }[] };
  buildWithUs: { title: string; text: string; primaryLabel: string; primaryHref: string; secondaryLabel: string; secondaryHref: string };
  news: { eyebrow: string; title: string; text: string; ctaLabel: string; ctaHref: string };
  cta: Cta;
};

export type SolutionsContent = {
  seo: Seo;
  hero: Hero;
  intro: { badge: string; paragraphs: string[]; textStyle?: TextStyleLabel; fontSize?: Partial<FontSize> };
  infrastructure: {
    number: string;
    title: string;
    lead: string;
    subTitle: string;
    subText: string;
    steps: { label: string; title: string; text: string; image: CmsImage }[];
    statement: string;
    cards: { eyebrow: string; title: string; text: string; highlight: boolean }[];
    ctaLabel: string;
    ctaHref: string;
  };
  intelligence: {
    number: string;
    title: string;
    lead: string;
    eyebrow: string;
    intro: string;
    items: { title: string; text: string; image: CmsImage }[];
    shapedTitle: string;
    shapedItems: string[];
    shapedText: string;
    ctaLabel: string;
    ctaHref: string;
  };
  initiatives: {
    number: string;
    title: string;
    lead: string;
    figureLabel: string;
    figure: CmsImage;
    entrustTitle: string;
    entrustText: string;
    entrustItems: string[];
    phasesBadge: string;
    phasesTitle: string;
    phases: { title: string; text: string }[];
    closing: string;
    ctaLabel: string;
    ctaHref: string;
  };
  cta: Cta;
};

export type EnterpriseProductsContent = {
  seo: Seo;
  hero: Hero;
  products: {
    title: string;
    items: { name: string; tagline: string; summary: string; href: string; color: string; logo: CmsImage; image: CmsImage }[];
  };
  partners: {
    title: string;
    text: string;
    items: { name: string; tagline: string; text: string; ctaLabel: string; href: string; logo: CmsImage }[];
  };
  cta: Cta;
};

export type ProductFigure = { label: string; title: string; caption: string; image: CmsImage; source: string };

export type ProductContent = {
  seo: Seo;
  name: string;
  hero: {
    eyebrow: string;
    title: string;
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
    backgroundImage: CmsImage;
    logo?: CmsImage;
  };
  overview: string[];
  blocks: {
    number: string;
    title: string;
    text: string;
    points: { title: string; text: string }[];
    figures: ProductFigure[];
  }[];
  audience: { eyebrow: string; title: string; text: string; closing?: string; ctaLabel?: string; ctaHref?: string };
  cta: Cta;
};

export type CaseStudyItem = {
  title: string;
  /** The challenge, shown on the card and at the top of the study. */
  text: string;
  solution: string;
  impact: string[];
  takeaway: string;
  tag: string;
  metric: string;
  metricLabel: string;
  client: string;
  image: CmsImage;
  logo: CmsImage;
  /** "light" sets the mark on a white plate so dark ink stays readable on the dark card. */
  logoPlate?: "light";
};

export type CaseStudiesContent = {
  seo: Seo;
  hero: Hero;
  filters: string[];
  items: CaseStudyItem[];
  band: CmsImage;
  cta: Cta;
};

export type InsightsContent = {
  seo: Seo;
  hero: Hero;
  categories: string[];
  featuredTitle: string;
  moreTitle: string;
  emptyText: string;
  cta: Cta;
};

/** A paper figure. `after` is the paragraph index it follows; omitted, it follows the last paragraph. */
export type PostFigure = CmsImage & { after?: number };

export type Post = {
  slug: string;
  title: string;
  category: string;
  date: string;
  featured: boolean;
  published: boolean;
  excerpt: string;
  /** Card and listing image. */
  image: CmsImage;
  /** Article plate under the title. Falls back to `image`. */
  heroImage?: CmsImage;
  body: string[];
  /** Figure placed after the opening paragraphs. */
  bodyFigure?: CmsImage;
  /** Named parts of the write-up, after the opening paragraphs. */
  sections?: { title: string; paragraphs: string[]; figures?: PostFigure[] }[];
};

export type PostsContent = { items: Post[] };

export type CareersContent = {
  seo: Seo;
  hero: Hero;
  intro: string[];
  image: CmsImage;
  openRoles: {
    title: string;
    emptyText: string;
    ctaLabel: string;
    ctaHref: string;
    roles: { title: string; location: string; type: string; href: string }[];
  };
  work: { title: string; paragraphs: string[] };
  cta: Cta;
};

export type ContactContent = {
  seo: Seo;
  badge: string;
  title: string;
  text: string;
  image: CmsImage;
  form: Record<
    | "title"
    | "nameLabel"
    | "namePlaceholder"
    | "emailLabel"
    | "emailPlaceholder"
    | "phoneLabel"
    | "phonePlaceholder"
    | "companyLabel"
    | "companyPlaceholder"
    | "messageLabel"
    | "messagePlaceholder"
    | "submitLabel"
    | "successTitle"
    | "successText",
    string
  >;
  getInTouchTitle: string;
};

export type ContentMap = {
  site: SiteContent;
  home: HomeContent;
  about: AboutContent;
  solutions: SolutionsContent;
  "enterprise-products": EnterpriseProductsContent;
  "case-studies": CaseStudiesContent;
  insights: InsightsContent;
  posts: PostsContent;
  careers: CareersContent;
  contact: ContactContent;
  "products/lift": ProductContent;
  "products/reckon": ProductContent;
  "products/sentinel": ProductContent;
  "products/useforms": ProductContent;
};
