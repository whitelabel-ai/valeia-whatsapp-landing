import { NextRequest, NextResponse } from "next/server";
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
      const hasThemeChanges =
        payload.fields?.theme || payload.fields?.customTheme;
      if (hasThemeChanges) {
        console.log("🎨 [Webhook] Detectados cambios en el tema");
        try {
          const navigationPages = await getNavigationPages();
          navigationPages.forEach((page) => {
            if (page.slug) {
              paths.push(`/${page.slug}`);
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

  return [...new Set(paths)].filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    console.log("🟢 [Webhook] Solicitud recibida");
    const rawBody = await request.text();
    console.log("📦 [Webhook] Cuerpo recibido:", rawBody);

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
      console.log(`🔄 [Webhook] Intentando revalidar manualmente: ${path}`);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_DOMAIN}/api/revalidate?path=${path}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.ok) {
          console.log(`✅ [Webhook] Revalidación exitosa para: ${path}`);
        } else {
          console.error(
            `❌ [Webhook] Falló la revalidación para: ${path}, Status: ${response.status}`
          );
        }
      } catch (error) {
        console.error(
          `🔥 [Webhook] Error al intentar revalidar ${path}:`,
          error
        );
      }
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
