import { notFound } from "next/navigation";
import {
  getDynamicPage,
  getLandingPage,
  getNavigationPages,
  getLegalPages,
  getBlogs,
} from "@/lib/contentful";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, MARKS, INLINES } from "@contentful/rich-text-types";

// Configurar revalidación cada 24 horas
export const revalidate = 60;

// Generar todas las rutas estáticamente en build time
export async function generateStaticParams() {
  const { blogs } = await getBlogs();
  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const [page, landingPage, navigationPages, legalPages] = await Promise.all([
    getDynamicPage(params.slug),
    getLandingPage(),
    getNavigationPages(),
    getLegalPages(),
  ]);

  if (!page || !landingPage || page.location !== "blog") {
    notFound();
  }

  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );
  const footerSection = landingPage.sections.find(
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
        />
      )}
      <main className="py-24">
        <article className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            {page.featuredImage && (
              <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
                <img
                  src={`https:${page.featuredImage.fields.file.url}`}
                  alt={page.featuredImage.fields.title || page.title || ""}
                  className="object-cover"
                />
              </div>
            )}
            <div className="mb-8">
              <div className="flex items-center gap-4 text-foreground/60">
                {page.author && <span>{page.author}</span>}
                {page.publishDate && (
                  <time dateTime={page.publishDate}>
                    {new Date(page.publishDate).toLocaleDateString()}
                  </time>
                )}
              </div>
            </div>
            <div className="prose prose-invert max-w-none">
              {page.content && documentToReactComponents(page.content, options)}
            </div>
          </div>
        </article>
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
