export function generateOrganizationSchema(landingPage: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: landingPage.title,
    description: landingPage.description,
    url: process.env.NEXT_PUBLIC_DOMAIN,
    logo: landingPage.sections.find(
      (section: any) => section.sys.contentType.sys.id === "headerSection"
    )?.fields?.logo?.fields?.file?.url
      ? `https:${
          landingPage.sections.find(
            (section: any) => section.sys.contentType.sys.id === "headerSection"
          )?.fields?.logo?.fields?.file?.url
        }`
      : undefined,
  };
}

export function generateBlogPostSchema(post: any) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.featuredImage?.fields?.file?.url
      ? `https:${post.featuredImage.fields.file.url}`
      : undefined,
    datePublished: post.publishDate,
    dateModified: post.sys?.updatedAt,
    author: {
      "@type": "Person",
      name: post.author || "Anonymous",
    },
  };
}
