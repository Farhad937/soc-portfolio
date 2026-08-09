import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jbmono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jbmono" });

// Metadata generation runs separately from the page tree and can't
// easily share a per-request fetch, so it still reads the static site
// object. Wiring SEO metadata to the CMS is Phase 25, not Phase 1/2 —
// noted deliberately rather than silently left half-done.
export const metadata: Metadata = {
  title: `${site.name} — ${site.role}`,
  description: site.tagline,
};

/**
 * True root layout — html/body/fonts/global CSS only. Deliberately has
 * NO Nav/Footer here: those are public-site chrome and now live in
 * src/app/(site)/layout.tsx, scoped only to public routes. /admin gets
 * its own distinct chrome (src/app/admin/(protected)/layout.tsx) rather
 * than inheriting the portfolio's public header/footer.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jbmono.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
