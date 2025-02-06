import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getNavigationPages } from "@/lib/contentful";

// Helper function to get the paths to revalidate based on Contentful entry
async function getPathsToRevalidate(
  contentType: string,
  slug: string | undefined,
  payload: any
): Promise<string[]> {
  const paths: string[] = [];

  // Siempre revalidar la página principal
  paths.push("/");

  switch (contentType) {
    case "dynamicPage":
      if (slug) {
        paths.push(`/${slug}`);
      }
      break;
    case "landingPage": {
      // Si se actualizó el tema o customTheme, revalidar todas las rutas
      const hasThemeChanges =
        payload.fields?.theme || payload.fields?.customTheme;
      if (hasThemeChanges) {
        console.log("🎨 [Webhook] Detectados cambios en el tema");
        try {
          // Obtener todas las páginas dinámicas
          const navigationPages = await getNavigationPages();
          navigationPages.forEach((page) => {
            if (page.slug) {
              paths.push(`/${page.slug}`);
              // Si es una página de blog, también revalidar la ruta del blog
              if (page.location === "blog") {
                paths.push("/blog");
                paths.push(`/blog/${page.slug}`);
              }
            }
          });
        } catch (error) {
          console.error("❌ [Webhook] Error obteniendo páginas:", error);
        }
      }
      break;
    }
    case "blogPost":
      if (slug) {
        paths.push(`/blog/${slug}`);
        paths.push("/blog");
      }
      break;
  }

  // Eliminar duplicados y filtrar rutas vacías
  return [...new Set(paths)].filter(Boolean);
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
      console.error("🚨 [Webhook] Error: Dominio del webhook no configurado");
      return NextResponse.json(
        { message: "Secreto del webhook no configurado" },
        { status: 500 }
      );
    }

    if (signature !== webhookSecret) {
      console.error("⛔ [Webhook] Error: Firma inválida");
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

    const contentType = payload.sys?.contentType?.sys?.id;
    const slug = payload.fields?.slug?.[payload.sys?.locale || "en-US"];

    if (!contentType) {
      console.error("⚠️ [Webhook] Error: Falta contentType en el payload");
      return NextResponse.json(
        { message: "Falta contentType en el payload" },
        { status: 400 }
      );
    }

    const pathsToRevalidate = await getPathsToRevalidate(
      contentType,
      slug,
      payload
    );
    console.log("🛤️ [Webhook] Rutas a revalidar:", pathsToRevalidate);

    // Revalidar todas las rutas necesarias
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
