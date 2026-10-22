import { Azeret_Mono, DM_Sans, Fraunces, IBM_Plex_Sans, Inter, Manrope, Source_Serif_4, Space_Grotesk } from "next/font/google";
import localFont from "next/font/local";

export const generalSans = localFont({
  src: [
    { path: "../fonts/general-sans-regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/general-sans-medium.woff2", weight: "500", style: "normal" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});

export const azeretMono = Azeret_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-azeret-mono",
  display: "swap",
});

// Alternates for the CMS typography setting. Not preloaded, so a browser only downloads the ones in use.
const inter = Inter({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-inter", display: "swap", preload: false });
const dmSans = DM_Sans({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-dm-sans", display: "swap", preload: false });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", display: "swap", preload: false });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk", display: "swap", preload: false });
const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-ibm-plex-sans",
  display: "swap",
  preload: false,
});
const fraunces = Fraunces({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-fraunces", display: "swap", preload: false });
const sourceSerif = Source_Serif_4({ subsets: ["latin"], style: ["normal", "italic"], variable: "--font-source-serif", display: "swap", preload: false });

export const fontVariables = [generalSans, azeretMono, inter, dmSans, manrope, spaceGrotesk, ibmPlexSans, fraunces, sourceSerif]
  .map((font) => font.variable)
  .join(" ");
