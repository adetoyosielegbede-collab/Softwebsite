export type Path = (string | number)[];

export type Media = {
  id: string;
  label: string;
  src: string;
  alt: string;
};

export type Partner = Media & {
  name: string;
  width: number;
  height: number;
};

export type FocusArea = {
  number: string;
  title: string;
  body: string;
  more: string;
  href: string;
  link: string;
  image: Media;
};

export type Audience = {
  title: string;
  body: string;
  items: string[];
  image: Media;
};

export type WorkStep = {
  number: string;
  kicker: string;
  title: string;
  body: string;
};

export type Milestone = {
  year: string;
  title: string;
  body: string;
};

export type Principle = {
  number: string;
  title: string;
  body: string;
};

export type Leader = {
  name: string;
  role: string;
  image: Media;
};

export type Point = {
  number: string;
  title: string;
  body: string;
};

export type Note = {
  title: string;
  body: string;
};

export type SolutionArea = {
  id: string;
  number: string;
  title: string;
  lede: string;
  image: Media;
  points: Point[];
  notes: Note[];
  close: string;
};

export type Product = {
  slug: string;
  kind: string;
  name: string;
  eyebrow: string;
  headline: string;
  lede: string;
  summary: string;
  cta: string;
  href: string;
  image: Media;
  gallery: Media[];
  sections: Point[];
  audienceTitle: string;
  audienceBody: string;
  close: string;
};

export type CaseStudy = {
  slug: string;
  number: string;
  title: string;
  summary: string;
  sector: string;
  metric: string;
  metricLabel: string;
  client: string;
  image: Media;
};

export type Insight = {
  slug: string;
  title: string;
  category: string;
  date: string;
  excerpt: string;
  minutes: string;
  image: Media;
  paragraphs: string[];
};

export type Role = {
  title: string;
  team: string;
  location: string;
  summary: string;
};

export type SiteContent = {
  meta: { title: string; description: string };
  contact: { email: string; company: string; lines: string[] };
  nav: { label: string; href: string }[];
  footer: {
    kicker: string;
    headline: string;
    cta: string;
    href: string;
    image: Media;
  };
  stats: { value: string; label: string }[];
  partners: Partner[];
  home: {
    headline: string;
    subhead: string;
    support: string;
    story: string;
    heroImage: Media;
    primaryCta: string;
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
    focusTitle: string;
    focusIntro: string;
    focus: FocusArea[];
    audienceTitle: string;
    audienceIntro: string;
    audiences: Audience[];
    workTitle: string;
    work: WorkStep[];
    workCta: string;
    workHref: string;
    insightTitle: string;
    insightLink: string;
  };
  about: {
    kicker: string;
    headline: string;
    lede: string;
    image: Media;
    convictionTitle: string;
    conviction: string[];
    milestonesTitle: string;
    milestones: Milestone[];
    principlesTitle: string;
    principles: Principle[];
    leadershipTitle: string;
    leaders: Leader[];
    careersTitle: string;
    careersBody: string;
    careersCta: string;
    alumniCta: string;
  };
  solutions: {
    kicker: string;
    headline: string;
    lede: string;
    image: Media;
    areas: SolutionArea[];
    closeTitle: string;
    closeBody: string;
  };
  products: {
    kicker: string;
    headline: string;
    lede: string;
    partnerIntro: string;
    items: Product[];
  };
  caseStudies: {
    kicker: string;
    headline: string;
    lede: string;
    items: CaseStudy[];
  };
  insights: {
    kicker: string;
    headline: string;
    lede: string;
    items: Insight[];
  };
  careers: {
    kicker: string;
    headline: string;
    lede: string;
    image: Media;
    body: string[];
    empty: string;
    roles: Role[];
  };
  alumni: {
    kicker: string;
    headline: string;
    lede: string;
    body: string;
    formIntro: string;
    image: Media;
  };
  contactPage: {
    kicker: string;
    headline: string;
    lede: string;
  };
};

export type TextField = {
  path: Path;
  label: string;
  value: string;
  multiline: boolean;
  group: string;
};

export type MediaRef = {
  path: Path;
  media: Media;
};
