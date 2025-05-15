import "../globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getLandingPage } from "@/lib/contentful";
import { Metadata } from "next";
import Script from "next/script";
import { themeConfigs } from "@/lib/theme-config";
import { hexToHSL, generateGradients } from "@/lib/color-utils";
import { generateOrganizationSchema } from "@/lib/schema";
import { CanonicalUrl } from "@/components/seo/canonical";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string[] }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  try {
    const fullSlug = params.slug.join("/");
    const landingPage = await getLandingPage(fullSlug);

    if (!landingPage) {
      return {
        title: "Página en construcción",
        description: "Estamos experimentando dificultades técnicas.",
      };
    }

    const headerSection = landingPage.sections.find(
      (section) => section.sys.contentType.sys.id === "headerSection"
    );

    const logoUrl = headerSection?.fields?.logo?.fields?.file?.url
      ? `https:${headerSection.fields.logo.fields.file.url}`
      : "";

    const faviconUrl = landingPage.favicon?.fields?.file?.url
      ? `https:${landingPage.favicon.fields.file.url}`
      : logoUrl;

    const domain = process.env.NEXT_PUBLIC_DOMAIN;

    return {
      title: landingPage.title,
      description: landingPage.description,
      metadataBase: new URL(domain || "http://localhost:3000"),
      alternates: {
        canonical: `${domain}/${fullSlug}`,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-video-preview": -1,
          "max-image-preview": "large",
          "max-snippet": -1,
        },
      },
      icons: {
        icon: [
          { url: faviconUrl, sizes: "16x16", type: "image/png" },
          { url: faviconUrl, sizes: "32x32", type: "image/png" },
          { url: faviconUrl, sizes: "96x96", type: "image/png" },
        ],
        shortcut: faviconUrl,
        apple: [{ url: faviconUrl, sizes: "180x180", type: "image/png" }],
        other: [
          {
            rel: "mask-icon",
            url: faviconUrl,
            color: "#000000",
          },
        ],
      },
      manifest: "/site.webmanifest",
      openGraph: {
        title: landingPage.title,
        description: landingPage.description,
        type: "website",
        locale: "es",
        url: `${domain}/${fullSlug}`,
        siteName: landingPage.title,
        images: [
          {
            url: logoUrl,
            width: 60,
            height: 40,
            alt: headerSection?.fields?.logo?.fields?.title || "Logo",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: landingPage.title,
        description: landingPage.description,
        images: [logoUrl],
        creator: "@yourtwitterhandle",
      },
      verification: {
        google: "your-google-site-verification",
      },
    };
  } catch (error) {
    return {
      title: "Error - Sitio en Mantenimiento",
      description: "Estamos experimentando dificultades técnicas.",
    };
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string[] }>;
}

export default async function RootLayout(props: RootLayoutProps) {
  const params = await props.params;

  const {
    children
  } = props;

  let landingPage;
  try {
    const fullSlug = params.slug.join("/");
    landingPage = await getLandingPage(fullSlug);
  } catch (error) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  if (!landingPage) {
    return (
      <html lang="es" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    );
  }

  const valeiaChat = landingPage?.valeiaChat || false;

  // Determinar el tema a usar
  let themeConfig = themeConfigs["defaultDark"]; // Tema por defecto

  if (landingPage?.customTheme?.fields) {
    const customTheme = landingPage.customTheme.fields;
    const gradients = generateGradients(
      customTheme.primaryColor,
      customTheme.accentColor || customTheme.primaryColor
    );

    themeConfig = {
      background: hexToHSL(customTheme.backgroundColor),
      foreground: hexToHSL(customTheme.textColor),
      primary: hexToHSL(customTheme.primaryColor),
      primaryForeground: "0 0% 100%",
      muted: hexToHSL(customTheme.backgroundColor),
      mutedForeground: hexToHSL(customTheme.textColor),
      accent: hexToHSL(customTheme.accentColor || customTheme.primaryColor),
      accentForeground: "0 0% 100%",
      border: hexToHSL(customTheme.backgroundColor),
      cardGradient:
        customTheme.style === "glass"
          ? "linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))"
          : customTheme.style === "gradient"
            ? gradients.cardGradient
            : "none",
      textGradient:
        customTheme.style === "minimal" ? "none" : gradients.textGradient,
      backgroundGradient:
        customTheme.style === "minimal" ? "none" : gradients.backgroundGradient,
    };
  } else if (landingPage?.theme) {
    themeConfig = themeConfigs[landingPage.theme];
  }

  const borderRadius = landingPage?.customTheme?.fields?.borderRadius || 8;
  const schema = generateOrganizationSchema(landingPage);

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <CanonicalUrl />
        {schema && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(schema),
            }}
          />
        )}
        <style
          dangerouslySetInnerHTML={{
            __html: `
              :root {
                --background: ${themeConfig.background};
                --foreground: ${themeConfig.foreground};
                --primary: ${themeConfig.primary};
                --primary-foreground: ${themeConfig.primaryForeground};
                --muted: ${themeConfig.muted};
                --muted-foreground: ${themeConfig.mutedForeground};
                --accent: ${themeConfig.accent};
                --accent-foreground: ${themeConfig.accentForeground};
                --border: ${themeConfig.border};
                --card-gradient: ${themeConfig.cardGradient};
                --text-gradient: ${themeConfig.textGradient};
                --background-gradient: ${themeConfig.backgroundGradient};
                --radius: ${borderRadius}px;
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {valeiaChat && <Script src="chat-widget.es.js" />}
      </body>
    </html>
  );
}
