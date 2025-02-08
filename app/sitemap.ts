import { MetadataRoute } from "next";
import { getLandingPage, getNavigationPages, getBlogs } from "@/lib/contentful";
import { createClient } from "contentful";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const baseUrl = domain || "http://localhost:3000";

  try {
    // Initialize Contentful client
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });

    // Get all landing pages
    const landingPagesResponse = await client.getEntries({
      content_type: "landingPage",
      include: 4,
    });

    const routes: MetadataRoute.Sitemap = [];

    // Add root landing page
    const rootLanding = landingPagesResponse.items.find(
      (item: any) => item.fields.slug === "/"
    );

    routes.push({
      url: baseUrl,
      lastModified: rootLanding?.sys?.updatedAt || new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    // Process each landing page and its dynamic pages
    for (const landing of landingPagesResponse.items) {
      const landingFields = landing.fields as any;

      // Skip root landing as it's already added
      if (landingFields.slug !== "/") {
        // Add landing page
        routes.push({
          url: `${baseUrl}/${landingFields.slug}`.replace(/\/+/g, "/"),
          lastModified: landing.sys.updatedAt,
          changeFrequency: "weekly",
          priority: 0.9,
        });

        // Add dynamic pages for this landing
        if (landingFields.dynamicPages) {
          landingFields.dynamicPages.forEach((page: any) => {
            if (page.fields.isVisible) {
              routes.push({
                url: `${baseUrl}/${landingFields.slug}/${page.fields.slug}`.replace(
                  /\/+/g,
                  "/"
                ),
                lastModified: page.sys.updatedAt,
                changeFrequency: "weekly",
                priority: 0.8,
              });
            }
          });
        }
      }
    }

    // Get navigation pages
    const navigationPages = await getNavigationPages();

    // Process standard navigation pages (excluding blog and legal)
    navigationPages
      .filter(
        (page) =>
          page.isVisible && !["blog", "legal"].includes(page.location || "")
      )
      .forEach((page) => {
        let url = page.parentLandingSlug
          ? `${baseUrl}/${page.parentLandingSlug}/${page.slug}`
          : `${baseUrl}/${page.slug}`;

        routes.push({
          url: url.replace(/\/+/g, "/"),
          lastModified: new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });

    // Process legal pages
    navigationPages
      .filter((page) => page.isVisible && page.location === "legal")
      .forEach((page) => {
        routes.push({
          url: `${baseUrl}/${page.slug}`.replace(/\/+/g, "/"),
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.5,
        });
      });

    // Process blog pages
    const blogResponse = await getBlogs(1, 100);

    // Add main blog page
    routes.push({
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    });

    // Add individual blog posts
    blogResponse.blogs?.forEach((post) => {
      routes.push({
        url: `${baseUrl}/blog/${post.slug}`.replace(/\/+/g, "/"),
        lastModified: post.publishDate || new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    });

    // Remove any duplicate URLs that might have been generated
    const uniqueRoutes = routes.filter(
      (route, index, self) =>
        index === self.findIndex((r) => r.url === route.url)
    );

    return uniqueRoutes;
  } catch (error) {
    console.error("Error generating sitemap:", error);

    // Return minimal sitemap in case of error
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 1,
      },
    ];
  }
}
