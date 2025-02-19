import { getLandingPage } from "@/lib/contentful";

export async function generateManifest() {
  const landingPage = await getLandingPage();

  if (!landingPage) {
    // Fallback manifest data if landing page data is not available
    return {
      name: "GoLean",
      short_name: "GoLean",
      icons: [
        {
          src: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
      theme_color: "#ffffff",
      background_color: "#ffffff",
      display: "standalone",
    };
  }

  const { title, description, favicon } = landingPage;
  const faviconUrl = favicon?.fields?.file?.url
    ? `https:${landingPage?.favicon?.fields.file.url}`
    : "";

  return {
    name: title || "GoLean",
    short_name: title || "GoLean",
    description: description || "Landing Page",
    icons: faviconUrl
      ? [
          {
            src: faviconUrl,
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: faviconUrl,
            sizes: "512x512",
            type: "image/png",
          },
        ]
      : [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone",
  };
}

export async function GET() {
  const manifest = await generateManifest();
  return new Response(JSON.stringify(manifest), {
    headers: {
      "Content-Type": "application/manifest+json",
    },
  });
}
