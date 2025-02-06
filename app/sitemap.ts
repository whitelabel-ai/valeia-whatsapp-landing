import { MetadataRoute } from "next";
import { getLandingPage, getNavigationPages, getBlogs } from "@/lib/contentful";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const baseUrl = domain || "http://localhost:3000";

  // Obtener todas las páginas dinámicas
  const [landingPage, navigationPages, blogResponse] = await Promise.all([
    getLandingPage(),
    getNavigationPages(),
    getBlogs(1, 100),
  ]);

  const routes: MetadataRoute.Sitemap = [];

  // Página principal
  routes.push({
    url: baseUrl,
    lastModified: landingPage?.sys?.updatedAt || new Date(),
    changeFrequency: "daily",
    priority: 1,
  });

  // Páginas de navegación (excluyendo blog y legal)
  const standardPages = navigationPages?.filter(
    (page) => !["blog", "legal"].includes(page.location || "")
  );

  standardPages?.forEach((page) => {
    routes.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    });
  });

  // Páginas legales
  const legalPages = navigationPages?.filter(
    (page) => page.location === "legal"
  );

  legalPages?.forEach((page) => {
    routes.push({
      url: `${baseUrl}/${page.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    });
  });

  // Posts del blog
  blogResponse.blogs?.forEach((post) => {
    routes.push({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.publishDate || new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    });
  });

  return routes;
}
