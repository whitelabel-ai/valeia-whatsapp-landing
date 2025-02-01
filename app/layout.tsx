import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { getLandingPage } from "@/lib/contentful";
import { Metadata } from "next";
import Script from "next/script";
import { themeConfigs } from "@/lib/theme-config";
import { hexToHSL, generateGradients } from "@/lib/color-utils";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  try {
    const landingPage = await getLandingPage();

    if (!landingPage) {
      return {
        title: "Scof.ai - Soluciones de Automatización con IA",
        description:
          "Automatizamos tareas repetitivas y optimizamos tu flujo de trabajo con Inteligencia Artificial",
      };
    }

    const headerSection = landingPage.sections.find(
      (section) => section.sys.contentType.sys.id === "headerSection"
    );

    const logoUrl = headerSection?.fields?.logo?.fields?.file?.url
      ? `https:${headerSection.fields.logo.fields.file.url}`
      : "";

    return {
      title: landingPage.title,
      description: landingPage.description,
      metadataBase: new URL(
        process.env.NEXT_PUBLIC_DOMAIN ||
          "agregar la variable de entorno NEXT_PUBLIC_DOMAIN"
      ),
      icons: {
        icon: logoUrl,
        shortcut: logoUrl,
        apple: logoUrl,
      },
      openGraph: {
        title: landingPage.title,
        description: landingPage.description,
        type: "website",
        locale: "es",
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
      },
    };
  } catch (error) {
    // Si hay un error, retornamos metadata por defecto
    return {
      title: "Error - Sitio en Mantenimiento",
      description: "Estamos experimentando dificultades técnicas.",
    };
  }
}

interface RootLayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  let landingPage;
  try {
    landingPage = await getLandingPage();
  } catch (error) {
    // Si hay un error, renderizamos el layout básico
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

  const gtmId = landingPage?.googleTagManager;
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

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {gtmId && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
        <style>
          {`
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
          `}
        </style>
      </head>
      <body className={inter.className}>
        {gtmId && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}
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
