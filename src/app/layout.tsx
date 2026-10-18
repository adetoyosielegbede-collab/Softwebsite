import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { cookies } from "next/headers";
import { EditProvider } from "@/components/edit-provider";
import { isValidSession, SESSION_COOKIE } from "@/lib/auth";
import { getSite } from "@/lib/content";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite();
  return {
    title: { default: site.meta.title, template: "%s · Softcom" },
    description: site.meta.description,
  };
}

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  const editing = isValidSession(jar.get(SESSION_COOKIE)?.value);

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <EditProvider editing={editing}>{children}</EditProvider>
      </body>
    </html>
  );
}
