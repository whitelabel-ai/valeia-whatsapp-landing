import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "contentful";

// Función para obtener todas las rutas posibles del sitio
async function getAllPaths(): Promise<string[]> {
  try {
    console.log("🔍 [Webhook] Obteniendo todas las rutas del sitio");
    const paths = new Set<string>();

    // Siempre incluir la ruta principal
    paths.add("/");
    paths.add("/blog");

    // Inicializar cliente de Contentful
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });

    // Obtener todas las landing pages con sus páginas dinámicas
    const landingPagesResponse = await client.getEntries({
      content_type: "landingPage",
      include: 4, // Incluir referencias anidadas
    });

    console.log(
      `📑 [Webhook] Procesando ${landingPagesResponse.items.length} landing pages`
    );

    // Procesar cada landing page y todas sus páginas dinámicas
    landingPagesResponse.items.forEach((landing: any) => {
      const landingFields = landing.fields;

      // Agregar la ruta de la landing page si no es la principal
      if (landingFields.slug && landingFields.slug !== "/") {
        paths.add(`/${landingFields.slug}`);
      }

      // Procesar todas las páginas dinámicas de esta landing
      if (landingFields.dynamicPages) {
        landingFields.dynamicPages.forEach((page: any) => {
          const pageFields = page.fields;

          // Si es una página de blog, siempre usar el prefijo /blog/
          if (pageFields.location === "blog") {
            paths.add("/blog"); // Asegurar que la ruta principal del blog existe
            paths.add(`/blog/${pageFields.slug}`);
          }
          // Si es una página dinámica normal (no blog)
          else if (pageFields.slug) {
            const fullPath =
              landingFields.slug === "/"
                ? `/${pageFields.slug}`
                : `/${landingFields.slug}/${pageFields.slug}`;
            paths.add(fullPath.replace(/\/+/g, "/"));
          }
        });
      }
    });

    // Agregar rutas especiales
    paths.add("/sitemap.xml");
    paths.add("/robots.txt");

    console.log("🎯 [Webhook] Rutas encontradas:", Array.from(paths));
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
      console.error("⛔ [Webhook] Error: Firma inválida");
      return NextResponse.json({ message: "Firma inválida" }, { status: 401 });
    }

    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch (parseError) {
      console.error("❌ [Webhook] Error: JSON inválido", parseError);
      return NextResponse.json(
        { message: "JSON del payload inválido", error: String(parseError) },
        { status: 400 }
      );
    }

    // Obtener todas las rutas
    const pathsToRevalidate = await getAllPaths();
    console.log("🛤️ [Webhook] Revalidando rutas:", pathsToRevalidate);

    // Determinar si el cambio afecta al blog
    const isBlogChange =
      payload?.fields?.location?.["en-US"] === "blog" ||
      (payload?.sys?.contentType?.sys?.id === "dynamicPage" &&
        payload?.fields?.location?.["en-US"] === "blog");

    // Separar las rutas por tipo
    const blogPaths = pathsToRevalidate.filter((path) =>
      path.startsWith("/blog/")
    );
    const nonBlogPaths = pathsToRevalidate.filter(
      (path) => !path.startsWith("/blog/") && path !== "/" && path !== "/blog"
    );

    // Función para revalidar con reintento
    const revalidateWithRetry = async (path: string, retries = 3) => {
      for (let i = 0; i < retries; i++) {
        try {
          revalidatePath(path);
          console.log("✅ [Webhook] Ruta revalidada:", path);
          break;
        } catch (error) {
          console.error(
            `❌ [Webhook] Error revalidando ${path}, intento ${i + 1}:`,
            error
          );
          if (i === retries - 1) throw error;
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    };

    // Revalidar en orden específico con delays
    const revalidateInOrder = async () => {
      // Primer paso: Revalidar rutas principales
      await revalidateWithRetry("/");
      await new Promise((resolve) => setTimeout(resolve, 500));
      await revalidateWithRetry("/blog");

      // Segundo paso: Revalidar blogs si es un cambio de blog
      if (isBlogChange) {
        for (const blogPath of blogPaths) {
          await new Promise((resolve) => setTimeout(resolve, 300));
          await revalidateWithRetry(blogPath);
        }
      }

      // Tercer paso: Revalidar otras rutas
      for (const path of nonBlogPaths) {
        await new Promise((resolve) => setTimeout(resolve, 200));
        await revalidateWithRetry(path);
      }

      // Paso final: Revalidar nuevamente las rutas principales
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await revalidateWithRetry("/");
      await revalidateWithRetry("/blog");
    };

    // Ejecutar la revalidación
    await revalidateInOrder();

    return NextResponse.json(
      {
        message: "Revalidación exitosa",
        revalidated: [
          "/",
          "/blog",
          ...(isBlogChange ? blogPaths : []),
          ...nonBlogPaths,
        ],
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
