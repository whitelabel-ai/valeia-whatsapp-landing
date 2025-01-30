import {
  getBlogs,
  getBlogCategories,
  getRecentBlogs,
  getLandingPage,
  getNavigationPages,
} from "@/lib/contentful";
import { BlogList } from "@/components/blog/blog-list";
import { BlogSidebar } from "@/components/blog/blog-sidebar";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DynamicPage } from "@/types/contentful";
import { Metadata } from "next";

// Generar metadata dinámica para SEO
export async function generateMetadata(): Promise<Metadata> {
  const recentBlogs = await getRecentBlogs(1);
  const latestBlog = recentBlogs[0];

  return {
    title: latestBlog
      ? `Blog - ${latestBlog.title}`
      : "Blog - Artículos y Noticias",
    description: latestBlog
      ? `${latestBlog.title}. Explora nuestros artículos sobre tecnología, innovación y más.`
      : "Explora nuestros artículos sobre tecnología, innovación y más.",
  };
}

// Configurar revalidación cada 24 horas
export const revalidate = 86400; // 24 horas en segundos

// Loading component
function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-muted rounded w-1/4 mb-12"></div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card-gradient rounded-lg p-6">
              <div className="h-8 bg-muted rounded w-3/4 mb-4"></div>
              <div className="h-40 bg-muted rounded mb-4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          ))}
        </div>
        <div className="lg:col-span-4">
          <div className="card-gradient rounded-lg p-6">
            <div className="h-6 bg-muted rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-4 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function BlogPage() {
  const [blogs, categories, recentBlogs, landingPage, navigationPages] =
    await Promise.all([
      getBlogs(),
      getBlogCategories(),
      getRecentBlogs(3),
      getLandingPage(),
      getNavigationPages(),
    ]);

  if (!landingPage) {
    return null;
  }

  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );
  const footerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "footerSection"
  );

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
          <h1 className="text-4xl font-bold mb-12">Blog</h1>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8">
              <BlogList
                blogs={blogs.blogs}
                total={blogs.total}
                categories={categories}
              />
            </div>
            <div className="lg:col-span-4">
              <BlogSidebar categories={categories} recentBlogs={recentBlogs} />
            </div>
          </div>
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
