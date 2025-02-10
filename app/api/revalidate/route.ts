import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "contentful";
import { getNavigationPages } from "@/lib/contentful";

// Función para obtener todas las rutas posibles del sitio
async function getAllPaths(): Promise<string[]> {
  try {
    console.log("🔍 [Webhook] Obteniendo todas las rutas del sitio");
    const paths = new Set<string>();

    // Siempre incluir la ruta principal
    paths.add("/");

    // Inicializar cliente de Contentful
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });

    // Obtener todas las landing pages
    const landingPagesResponse = await client.getEntries({
      content_type: "landingPage",
      include: 4,
    });

    console.log(
      `📑 [Webhook] Encontradas ${landingPagesResponse.items.length} landing pages`
    );

    // Procesar cada landing page y sus páginas dinámicas
    for (const landing of landingPagesResponse.items) {
      const landingFields = landing.fields as any;

      // Agregar ruta de la landing page
      if (landingFields.slug && landingFields.slug !== "/") {
        paths.add(`/${landingFields.slug}`);
      }

      // Procesar páginas dinámicas de la landing
      if (landingFields.dynamicPages) {
        landingFields.dynamicPages.forEach((page: any) => {
          if (page.fields.isVisible) {
            paths.add(
              `/${landingFields.slug}/${page.fields.slug}`.replace(/\/+/g, "/")
            );
          }
        });
      }
    }

    // Obtener todas las páginas de navegación
    const navigationPages = await getNavigationPages();
    console.log(
      `🧭 [Webhook] Encontradas ${navigationPages.length} páginas de navegación`
    );

    // Procesar páginas de navegación
    navigationPages.forEach((page) => {
      if (page.isVisible && page.slug) {
        if (page.location === "blog") {
          paths.add("/blog");
          paths.add(`/blog/${page.slug}`);
        } else if (page.parentLandingSlug) {
          paths.add(
            `/${page.parentLandingSlug}/${page.slug}`.replace(/\/+/g, "/")
          );
        } else {
          paths.add(`/${page.slug}`);
        }
      }
    });

    // Agregar rutas especiales
    paths.add("/blog");
    paths.add("/sitemap.xml");
    paths.add("/robots.txt");

    console.log(`🎯 [Webhook] Total de rutas encontradas: ${paths.size}`);
    return Array.from(paths);
  } catch (error) {
    console.error("❌ [Webhook] Error obteniendo rutas:", error);
    return ["/"];
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🟢 [Webhook] Solicitud recibida");
    const rawBody = await request.text();
    console.log("📦 [Webhook] Cuerpo recibido:", rawBody);

    const signature = request.headers.get("x-contentful-signature");
    console.log("🔑 [Webhook] Firma recibida:", signature);

    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;
    if (!webhookSecret) {
      console.error("🚨 [Webhook] Error: Secreto del webhook no configurado");
      return NextResponse.json(
        { message: "Secreto del webhook no configurado" },
        { status: 500 }
      );
    }

    if (signature !== webhookSecret) {
      console.error("⛔ [Webhook] Error: Firma inválida o no coincide");
      return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error(
        "❌ [Webhook] Error: No se pudo analizar el JSON del payload",
        parseError
      );
      return NextResponse.json(
        { message: "JSON del payload inválido", error: String(parseError) },
        { status: 400 }
      );
    }

    console.log(
      "📄 [Webhook] Payload procesado:",
      JSON.stringify(payload, null, 2)
    );

    // Obtener todas las rutas posibles
    const pathsToRevalidate = await getAllPaths();
    console.log("🛤️ [Webhook] Rutas a revalidar:", pathsToRevalidate);

    // Revalidar todas las rutas
    for (const path of pathsToRevalidate) {
      revalidatePath(path);
      console.log("✅ [Webhook] Ruta revalidada:", path);
    }

    return NextResponse.json(
      {
        message: "Revalidación exitosa",
        revalidated: pathsToRevalidate,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("🔥 [Webhook] Error inesperado:", error);
    return NextResponse.json(
      { message: "Error procesando el webhook", error: String(error) },
      { status: 500 }
    );
  }
}
