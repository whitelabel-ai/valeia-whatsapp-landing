import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { getNavigationPages, getLandingPage } from "@/lib/contentful";
import Link from "next/link";

export default async function NotFound() {
  const [navigationPages, landingPage] = await Promise.all([
    getNavigationPages(),
    getLandingPage(),
  ]);

  if (!landingPage) {
    return null;
  }

  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType?.sys.id === "headerSection"
  );
  const footerSection = landingPage.sections.find(
    (section) => section.sys.contentType?.sys.id === "footerSection"
  );

  return (
    <>
      {headerSection && (
        <Header
          content={headerSection.fields}
          navigationPages={navigationPages}
        />
      )}
      <main className="flex min-h-[80vh] items-center justify-center">
        <div className="container px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
          <p className="text-foreground/60 mb-8">
            Lo sentimos, la página que estás buscando no existe o ha sido
            movida.
          </p>
          <Button asChild>
            <Link href="/">Volver al inicio</Link>
          </Button>
        </div>
      </main>
      {footerSection && (
        <Footer
          content={footerSection.fields}
          navigationPages={navigationPages}
        />
      )}
    </>
  );
}
