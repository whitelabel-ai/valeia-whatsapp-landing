import { Hero } from "@/components/hero";
import { Partners } from "@/components/Partners";
import { Process } from "@/components/Features";
import { Pricing } from "@/components/pricing";
import { UseCases } from "@/components/use-cases";
import { Cta } from "@/components/cta";
import { ProductDemo } from "@/components/product-demo";
import { Benefits } from "@/components/benefits";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Faq } from "@/components/faq";
import { getNavigationPages, getLandingPage } from "@/lib/contentful";
import { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await getLandingPage();

  return {
    title: landingPage?.title || "",
    description: landingPage?.description || "",
  };
}

export default async function Home() {
  const [navigationPages, landingPage] = await Promise.all([
    getNavigationPages(),
    getLandingPage(),
  ]);

  if (!landingPage) {
    throw new Error("Required content not found");
  }

  // Función para renderizar una sección basada en su tipo de contenido
  const renderSection = (section: any, index: number) => {
    // Verificamos que section y sys existan
    if (!section || !section.sys || !section.sys.contentType) {
      return null;
    }

    const contentTypeId = section.sys.contentType.sys.id;
    const sectionContent = section.fields;

    // Generamos una key única para cada sección usando el índice y el ID
    const sectionKey = `${contentTypeId}-${section.sys.id}-${index}`;

    // Renderizamos la sección correspondiente basada en el tipo de contenido
    switch (contentTypeId) {
      case "headerSection":
        return (
          <Header
            key={sectionKey}
            content={sectionContent}
            navigationPages={navigationPages}
          />
        );
      case "heroSection":
        return <Hero key={sectionKey} content={sectionContent} />;
      case "partnersSection":
        return <Partners key={sectionKey} content={sectionContent} />;
      case "processSection":
        return <Process key={sectionKey} content={sectionContent} />;
      case "pricingSection":
        return <Pricing key={sectionKey} content={sectionContent} />;
      case "faqSection":
        return <Faq key={sectionKey} content={sectionContent} />;
      case "useCasesSection":
        return <UseCases key={sectionKey} content={sectionContent} />;
      case "productDemoSection":
        return <ProductDemo key={sectionKey} content={sectionContent} />;
      case "benefitsSection":
        return <Benefits key={sectionKey} content={sectionContent} />;
      case "ctaSection":
        return <Cta key={sectionKey} content={sectionContent} />;
      case "footerSection":
        return (
          <Footer
            key={sectionKey}
            content={sectionContent}
            navigationPages={navigationPages}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {landingPage.sections?.map((section, index) =>
        renderSection(section, index)
      )}
    </>
  );
}
