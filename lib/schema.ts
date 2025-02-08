import { LandingPage, DynamicPage } from "@/types/contentful";

export function generateOrganizationSchema(landingPage: LandingPage) {
  if (!landingPage) return null;

  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );

  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const logoUrl = headerSection?.fields?.logo?.fields?.file?.url
    ? `https:${headerSection.fields.logo.fields.file.url}`
    : undefined;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: landingPage.title || "",
    description: landingPage.description || "",
    url: domain || "",
    ...(logoUrl && { logo: logoUrl }),
  };

  // Only add optional properties if they exist
  const socialLinks = getSocialLinks(landingPage);
  if (socialLinks.length > 0) {
    schema.sameAs = socialLinks;
  }

  const contactPoints = getContactPoints(landingPage);
  if (contactPoints.length > 0) {
    schema.contactPoint = contactPoints;
  }

  const address = getAddress(landingPage);
  if (address) {
    schema.address = address;
  }

  const subOrganization = getDynamicPagesSchema(landingPage);
  if (subOrganization.length > 0) {
    schema.subOrganization = subOrganization;
  }

  return schema;
}

export function generateWebSiteSchema(landingPage: LandingPage) {
  if (!landingPage) return null;

  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: landingPage.title || "",
    description: landingPage.description || "",
    url: domain || "",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${domain || ""}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateBreadcrumbSchema(
  landingPage: LandingPage,
  currentPath: string
) {
  if (!landingPage || !currentPath) return null;

  const domain = process.env.NEXT_PUBLIC_DOMAIN || "";
  const pathSegments = currentPath.split("/").filter(Boolean);

  const breadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        item: {
          "@id": domain,
          name: "Inicio",
        },
      },
    ],
  };

  let currentUrl = domain;
  pathSegments.forEach((segment, index) => {
    currentUrl += `/${segment}`;
    breadcrumbList.itemListElement.push({
      "@type": "ListItem",
      position: index + 2,
      item: {
        "@id": currentUrl,
        name: segment === landingPage.slug ? landingPage.title : segment,
      },
    });
  });

  return breadcrumbList;
}

export function generateBlogPostSchema(
  post: DynamicPage,
  landingPage: LandingPage
) {
  if (!post || !landingPage) return null;

  const domain = process.env.NEXT_PUBLIC_DOMAIN || "";
  const url = `${domain}/${landingPage.slug}/${post.slug}`;

  const schema: any = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title || "",
    url: url,
  };

  // Add optional properties only if they exist
  if (post.seoDescription) {
    schema.description = post.seoDescription;
  }

  if (post.featuredImage?.fields?.file?.url) {
    schema.image = `https:${post.featuredImage.fields.file.url}`;
  }

  if (post.publishDate) {
    schema.datePublished = post.publishDate;
  }

  if (post.sys?.updatedAt) {
    schema.dateModified = post.sys.updatedAt;
  }

  if (post.author) {
    schema.author = {
      "@type": "Person",
      name: post.author,
    };
  }

  const headerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "headerSection"
  );

  const publisherLogo = headerSection?.fields?.logo?.fields?.file?.url
    ? `https:${headerSection.fields.logo.fields.file.url}`
    : undefined;

  schema.publisher = {
    "@type": "Organization",
    name: landingPage.title || "",
    ...(publisherLogo && {
      logo: {
        "@type": "ImageObject",
        url: publisherLogo,
      },
    }),
  };

  schema.mainEntityOfPage = {
    "@type": "WebPage",
    "@id": url,
  };

  if (post.tags && post.tags.length > 0) {
    schema.keywords = post.tags.join(", ");
  }

  return schema;
}

// Helper functions
function getSocialLinks(landingPage: LandingPage): string[] {
  const footerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "footerSection"
  );

  if (!footerSection?.fields?.socialLinks) return [];

  return footerSection.fields.socialLinks
    .map((link: { fields: { url: string } }) => link.fields?.url)
    .filter(Boolean);
}

function getContactPoints(landingPage: LandingPage): any[] {
  const footerSection = landingPage.sections.find(
    (section) => section.sys.contentType.sys.id === "footerSection"
  );

  if (!footerSection?.fields) return [];

  const contactPoints = [];

  if (footerSection.fields.email) {
    contactPoints.push({
      "@type": "ContactPoint",
      contactType: "customer service",
      email: footerSection.fields.email,
    });
  }

  if (footerSection.fields.phone) {
    contactPoints.push({
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: footerSection.fields.phone,
    });
  }

  return contactPoints;
}

function getAddress(landingPage: LandingPage) {
  return undefined;
}

function getDynamicPagesSchema(landingPage: LandingPage): any[] {
  if (!landingPage.dynamicPages) return [];

  return landingPage.dynamicPages
    .filter((page) => page.fields.title && page.fields.slug)
    .map((page) => ({
      "@type": "WebPage",
      name: page.fields.title || "",
      description: page.fields.seoDescription || "",
      url: `${process.env.NEXT_PUBLIC_DOMAIN || ""}/${landingPage.slug}/${
        page.fields.slug
      }`,
    }));
}
