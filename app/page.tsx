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
import {
  getNavigationPages,
  getLandingPage,
  checkContentfulConnection,
} from "@/lib/contentful";
import { Metadata } from "next";

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const landingPage = await getLandingPage();

  return {
    title: landingPage?.title || "Sitio en Construcción",
    description:
      landingPage?.description ||
      "Estamos trabajando en el contenido de este sitio.",
  };
}

export default async function Home() {
  // Verificar la conexión con Contentful
  const isConnected = await checkContentfulConnection();

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Error de Conexión
          </h1>
          <p className="text-foreground/60 mb-8">
            No se pudo establecer conexión con el sistema de contenido. Por
            favor, inténtelo más tarde.
          </p>
        </div>
      </div>
    );
  }

  const [navigationPages, landingPage] = await Promise.all([
    getNavigationPages(),
    getLandingPage(),
  ]);

  if (!landingPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Sitio en Construcción
          </h1>
          <p className="text-foreground/60 mb-8">
            Estamos trabajando en el contenido de este sitio. Vuelva pronto para
            ver las novedades.
          </p>
        </div>
      </div>
    );
  }

  // Si no hay secciones, mostrar mensaje
  if (!landingPage.sections || landingPage.sections.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Contenido en Preparación
          </h1>
          <p className="text-foreground/60 mb-8">
            El contenido de este sitio está siendo preparado. Pronto estará
            disponible.
          </p>
        </div>
      </div>
    );
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
