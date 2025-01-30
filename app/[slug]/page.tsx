import { notFound } from "next/navigation";
import {
  getDynamicPage,
  getLandingPage,
  getNavigationPages,
  getLegalPages,
} from "@/lib/contentful";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";

export const revalidate = 86400;

// Esta función es requerida para generar las rutas estáticas
export async function generateStaticParams() {
  const [navigationPages, legalPages] = await Promise.all([
    getNavigationPages(),
    getLegalPages(),
  ]);

  // Combinar todas las páginas para generar las rutas
  const allPages = [...navigationPages, ...legalPages];
  return allPages.map((page) => ({
    slug: page.slug,
  }));
}

export default async function DynamicPage({
  params,
}: {
  params: { slug: string };
}) {
  const [landingPage, navigationPages] = await Promise.all([
    getLandingPage(),
    getNavigationPages(),
  ]);

  if (!landingPage) {
    notFound();
  }

  // Obtener header y footer de las secciones de la landing page
  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );
  const footerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "footerSection"
  );

  // Intentar obtener la página como dinámica o legal
  const page = await getDynamicPage(params.slug);

  if (!page || !page.isVisible) {
    notFound();
  }

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
