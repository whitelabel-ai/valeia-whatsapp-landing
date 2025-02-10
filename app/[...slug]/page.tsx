import { notFound } from "next/navigation";
import {
  getDynamicPage,
  getLandingPage,
  getNavigationPages,
} from "@/lib/contentful";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";
import { Hero } from "@/components/hero";
import { Partners } from "@/components/Partners";
import { Process } from "@/components/Features";
import { Pricing } from "@/components/pricing";
import { UseCases } from "@/components/use-cases";
import { Cta } from "@/components/cta";
import { ProductDemo } from "@/components/product-demo";
import { Benefits } from "@/components/benefits";
import { Faq } from "@/components/faq";
import { LeadMagnetSection } from "@/components/LeadMagnet";

export const revalidate = 120;

export default async function DynamicPage({
  params,
}: {
  params: { slug: string[] };
}) {
  // Construir el slug completo desde el array de segmentos
  const fullSlug = params.slug.join("/");
  const parentSlug = params.slug.length > 1 ? params.slug[0] : "/";
  const pageSlug = params.slug[params.slug.length - 1];

  // Primero intentar obtener una landing page con este slug
  const landingPage = await getLandingPage(fullSlug);
  const navigationPages = await getNavigationPages();

  // Si es una landing page, renderizar sus secciones
  if (landingPage && landingPage.isVisible) {
    return (
      <>
        {landingPage.sections?.map((section, index) => {
          if (!section || !section.sys || !section.sys.contentType) {
            return null;
          }

          const contentTypeId = section.sys.contentType.sys.id;
          const sectionContent = section?.fields;
          const sectionKey = `${contentTypeId}-${section.sys.id}-${index}`;

          switch (contentTypeId) {
            case "headerSection":
              return (
                <Header
                  key={sectionKey}
                  content={sectionContent}
                  navigationPages={navigationPages}
                  currentLandingSlug={landingPage.slug}
                />
              );
            case "heroSection":
              return <Hero key={sectionKey} content={sectionContent} />;
            case "leadMagnetSection":
              return (
                <LeadMagnetSection key={sectionKey} content={sectionContent} />
              );
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
        })}
      </>
    );
  }

  // Si no es una landing page, intentar obtener una página dinámica
  const [page, parentLandingPage] = await Promise.all([
    getDynamicPage(pageSlug, parentSlug),
    getLandingPage(parentSlug),
  ]);

  if (!page || !page.isVisible || !parentLandingPage) {
    notFound();
  }

  // Verificar que la página pertenece a la landing page padre
  const belongsToParent = parentLandingPage.dynamicPages?.some(
    (dynamicPage) => dynamicPage.fields.slug === pageSlug
  );

  if (!belongsToParent && parentSlug !== "/") {
    notFound();
  }

  const headerSection = parentLandingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );
  const footerSection = parentLandingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "footerSection"
  );

  const options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: any) => (
        <p className="mb-4">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: any) => (
        <h1 className="text-4xl font-bold mb-6">{children}</h1>
      ),
      [BLOCKS.HEADING_2]: (node: any, children: any) => (
        <h2 className="text-3xl font-bold mb-4">{children}</h2>
      ),
      [BLOCKS.HEADING_3]: (node: any, children: any) => (
        <h3 className="text-2xl font-bold mb-3">{children}</h3>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: any) => (
        <ul className="list-disc pl-6 mb-4">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: any) => (
        <ol className="list-decimal pl-6 mb-4">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: any) => (
        <li className="mb-2">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: any) => (
        <blockquote className="border-l-4 border-primary pl-4 italic my-4">
          {children}
        </blockquote>
      ),
      [INLINES.HYPERLINK]: (node: any, children: any) => (
        <a
          href={node.data.uri}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {children}
        </a>
      ),
    },
    renderMark: {
      [MARKS.BOLD]: (text: any) => (
        <strong className="font-bold">{text}</strong>
      ),
      [MARKS.ITALIC]: (text: any) => <em className="italic">{text}</em>,
      [MARKS.CODE]: (text: any) => (
        <code className="bg-muted px-1.5 py-0.5 rounded">{text}</code>
      ),
    },
  };

  return (
    <>
      {headerSection && (
        <Header
          content={headerSection.fields}
          navigationPages={navigationPages}
          currentLandingSlug={parentSlug}
        />
      )}
      <main className="py-24">
        <div className="container mx-auto px-4">
          <article className="prose prose-invert mx-auto">
            <h1 className="text-4xl font-bold mb-4 mt-4">{page.title}</h1>
            {page.featuredImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <img
                  src={`https:${page.featuredImage.fields.file.url}`}
                  alt={page.featuredImage.fields.title || page.title || ""}
                  className="object-cover"
                />
              </div>
            )}
            <div className="prose prose-invert max-w-none">
              {page.content && documentToReactComponents(page.content, options)}
            </div>
          </article>
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
