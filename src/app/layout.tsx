import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "@/components/site/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { getContent } from "@/lib/content";
import { typographyStyle } from "@/lib/typography";
import { fontVariables } from "./fonts";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getContent("site");
  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:4317"),
    title: { default: site.seo.title, template: `%s — ${site.brand.name}` },
    description: site.seo.description,
    openGraph: {
      title: site.seo.title,
      description: site.seo.description,
      images: site.seo.shareImage.src ? [site.seo.shareImage.src] : undefined,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  colorScheme: "dark light",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const site = await getContent("site");
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark ${fontVariables} h-full antialiased`}
      style={typographyStyle(site.typography)}
    >
      <body className="min-h-full">
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark"){document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(t);document.documentElement.style.colorScheme=t}}catch(e){}',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{if(!sessionStorage.getItem("softcom:intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&scrollY<10){document.documentElement.classList.add("play-intro");sessionStorage.setItem("softcom:intro","1")}}catch(e){}',
          }}
        />
        <ThemeProvider>
          {children}
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
