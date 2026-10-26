import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Ambient } from "@/components/Ambient";
import { CursorLabel } from "@/components/CursorLabel";
import { Intro } from "@/components/Intro";
import { ScrollProgress } from "@/components/ScrollProgress";
import { SmoothScroll } from "@/components/SmoothScroll";
import { SpotlightTracker } from "@/components/SpotlightTracker";
import "./globals.css";

// Fonts ship with the repo, so builds never depend on a font CDN.
const geistSans = localFont({
  src: "./fonts/Geist.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});

const geistMono = localFont({
  src: "./fonts/GeistMono.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});

// Anybody: variable width (50-150) and weight (100-900). The width axis drives the motion.
const anybody = localFont({
  src: "./fonts/Anybody.woff2",
  variable: "--font-anybody",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mayank Jha, full-stack developer",
  description:
    "I take products from idea to launch: web apps, mobile apps, VS Code extensions and AI tools. Dovli, CrestClip, Rent Rush, Klaude and more.",
  openGraph: {
    title: "Mayank Jha, full-stack developer",
    description: "Products I designed, built and shipped, plus 30 merged open-source pull requests.",
    images: ["/media/showreel-poster.jpg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f6fb" },
    { media: "(prefers-color-scheme: dark)", color: "#050616" },
  ],
};

// Runs before paint: dark unless the visitor chose light, and the intro once per session.
const bootScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem("theme");d.setAttribute("data-theme",t==="light"?"light":"dark")}catch(e){d.setAttribute("data-theme","dark")}try{if(!sessionStorage.getItem("intro")){d.setAttribute("data-intro","");sessionStorage.setItem("intro","1")}}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${anybody.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body className="min-h-[100dvh]">
        <Intro />
        <Ambient />
        <ScrollProgress />
        <SmoothScroll />
        <SpotlightTracker />
        <CursorLabel />
        {children}
      </body>
    </html>
  );
}
