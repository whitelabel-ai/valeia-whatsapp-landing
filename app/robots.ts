import { MetadataRoute } from "next";
import { getLandingPage, getNavigationPages } from "@/lib/contentful";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  try {
    // Get all landing pages and navigation pages
    const landingPages = await getLandingPage();
    const navigationPages = await getNavigationPages();

    // Create allow rules for all valid routes
    const allowRules = new Set<string>();

    // Add root path
    allowRules.add("/");

    // Process landing pages and their dynamic pages
    if (landingPages) {
      // Add landing page path if it's not root
      if (landingPages.slug && landingPages.slug !== "/") {
        allowRules.add(`/${landingPages.slug}`);
      }

      // Add dynamic pages for the landing page
      if (landingPages.dynamicPages) {
        landingPages.dynamicPages.forEach((page) => {
          if (page.fields.isVisible && page.fields.slug) {
            // Clean the path by removing any duplicate slashes
            const path = `/${landingPages.slug}/${page.fields.slug}`.replace(
              /\/+/g,
              "/"
            );
            allowRules.add(path);
          }
        });
      }
    }

    // Process navigation pages
    navigationPages.forEach((page) => {
      if (page.isVisible && page.slug) {
        let path = "";

        if (page.location === "blog") {
          allowRules.add("/blog");
          path = `/blog/${page.slug}`;
        } else if (page.parentLandingSlug) {
          path = `/${page.parentLandingSlug}/${page.slug}`;
        } else {
          path = `/${page.slug}`;
        }

        // Clean the path by removing any duplicate slashes
        path = path.replace(/\/+/g, "/");
        allowRules.add(path);
      }
    });

    return {
      rules: [
        {
          userAgent: "*",
          allow: Array.from(allowRules),
          disallow: [
            "/api/*",
            "/admin/*",
            "/_next/*",
            "/static/*",
            "/*.json$",
            "/*.xml$",
            "/404",
            "/500",
          ],
        },
        {
          userAgent: "GPTBot",
          disallow: ["/"],
        },
        {
          userAgent: "CCBot",
          disallow: ["/"],
        },
      ],
      sitemap: `${domain}/sitemap.xml`,
      host: domain,
    };
  } catch (error) {
    // Fallback configuration if there's an error fetching routes
    console.error("Error generating robots.txt:", error);
    return {
      rules: {
        userAgent: "*",
        allow: "/",
      },
      sitemap: `${domain}/sitemap.xml`,
      host: domain,
    };
  }
}
