import Nav from "@/components/nav";
import Footer from "@/components/footer";
import { getSiteSettings } from "@/lib/content/site-settings";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const siteSettings = await getSiteSettings();

  return (
    <div className="flex min-h-screen flex-col">
      <Nav site={siteSettings} />
      <main className="flex-1">{children}</main>
      <Footer site={siteSettings} />
    </div>
  );
}
