import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    const hosts = ["softcom.ng", "www.softcom.ng"];
    return hosts.flatMap((host) => [
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
    ]);
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
