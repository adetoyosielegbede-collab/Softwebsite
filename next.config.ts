import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const hosts = ["softcom.ng", "www.softcom.ng"];
    const productSlugs = ["lift", "useforms", "sentinel", "reckon", "liquio", "rtgs-global"];
    const productRedirects = productSlugs.map((slug) => ({
      source: `/${slug}`,
      destination: `/enterprise-products/${slug}`,
      permanent: true,
    }));
    return [
      ...productRedirects,
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:path*", destination: "/insights", permanent: true },
      ...hosts.flatMap((host) => [
      {
        source: "/",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.softcom.xyz",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.softcom.xyz/:path*",
        permanent: true,
      },
    ]),
    ];
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  outputFileTracingIncludes: {
    "/**": ["./content/**/*"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
