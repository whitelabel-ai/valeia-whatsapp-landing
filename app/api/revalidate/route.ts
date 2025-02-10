import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createClient } from "contentful";

async function getAllPaths(landingSlug?: string): Promise<string[]> {
  try {
    console.log("🔍 [Webhook] Obteniendo rutas para revalidar");
    const paths = new Set<string>();

    // Inicializar cliente de Contentful
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });

    // Siempre revalidar la ruta principal y el blog
    paths.add("/");
    paths.add("/blog");

    // Obtener todas las entradas de blog
    const blogResponse = await client.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      limit: 1000,
    });

    // Agregar todas las rutas de blog
    blogResponse.items.forEach((blog: any) => {
      if (blog.fields.slug) {
        paths.add(`/blog/${blog.fields.slug}`);
      }
    });

    if (landingSlug) {
      // Si se especifica un slug, obtener esa landing específica
      const response = await client.getEntries({
        content_type: "landingPage",
        "fields.slug": landingSlug === "/" ? "/" : landingSlug,
        include: 4,
      });

      if (response.items.length > 0) {
        const landing = response.items[0].fields;
        paths.add(landingSlug === "/" ? "/" : `/${landingSlug}`);

        // Agregar páginas dinámicas de esta landing
        if (landing.dynamicPages) {
          Array.isArray(landing.dynamicPages) &&
            landing.dynamicPages.forEach((page: any) => {
              const pageFields = page.fields;
              if (pageFields.location === "blog") {
                paths.add("/blog");
                paths.add(`/blog/${pageFields.slug}`);
              } else {
                const fullPath =
                  landingSlug === "/"
                    ? `/${pageFields.slug}`
                    : `/${landingSlug}/${pageFields.slug}`;
                paths.add(fullPath.replace(/\/+/g, "/"));
              }
            });
        }
      }
    } else {
      // Si no se especifica slug, obtener todas las landings
      const landingPagesResponse = await client.getEntries({
        content_type: "landingPage",
        include: 4,
        limit: 1000,
      });

      landingPagesResponse.items.forEach((landing: any) => {
        const landingFields = landing.fields;
        if (landingFields.slug) {
          paths.add(
            landingFields.slug === "/" ? "/" : `/${landingFields.slug}`
          );

          if (landingFields.dynamicPages) {
            landingFields.dynamicPages.forEach((page: any) => {
              const pageFields = page.fields;
              if (pageFields.location === "blog") {
                paths.add(`/blog/${pageFields.slug}`);
              } else {
                const fullPath =
                  landingFields.slug === "/"
                    ? `/${pageFields.slug}`
                    : `/${landingFields.slug}/${pageFields.slug}`;
                paths.add(fullPath.replace(/\/+/g, "/"));
              }
            });
          }
        }
      });
    }

    // Agregar rutas especiales
    paths.add("/sitemap.xml");
    paths.add("/robots.txt");

    console.log("🎯 [Webhook] Rutas a revalidar:", Array.from(paths));
    return Array.from(paths);
  } catch (error) {
    console.error("❌ [Webhook] Error obteniendo rutas:", error);
    return ["/", "/blog"];
  }
}

async function revalidateWithRetry(path: string, retries = 3, delay = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 [Webhook] Intento ${i + 1} de revalidación para ${path}`);
      revalidatePath(path);

      // Esperar antes del siguiente intento
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Revalidar de nuevo para asegurar
      revalidatePath(path);
      console.log(`✅ [Webhook] Revalidación exitosa para ${path}`);
      return;
    } catch (error) {
      console.error(
        `❌ [Webhook] Error en intento ${i + 1} para ${path}:`,
        error
      );
      if (i === retries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
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

    // Obtener el slug de la landing page que se actualizó
    const landingSlug = payload?.fields?.slug?.["en-US"] || undefined;
    const contentType = payload?.sys?.contentType?.sys?.id;

    // Si es una entrada de blog o un cambio en la landing principal, forzar revalidación completa
    const forceFullRevalidation =
      contentType === "dynamicPage" ||
      landingSlug === "/" ||
      payload?.fields?.theme ||
      payload?.fields?.customTheme;

    // Obtener y revalidar las rutas afectadas
    const pathsToRevalidate = await getAllPaths(
      forceFullRevalidation ? undefined : landingSlug
    );
    console.log("🛤️ [Webhook] Revalidando rutas:", pathsToRevalidate);

    // Revalidar rutas principales primero
    const priorityPaths = ["/", "/blog"];
    const remainingPaths = pathsToRevalidate.filter(
      (path) => !priorityPaths.includes(path)
    );

    // Revalidar rutas principales con múltiples intentos
    for (const path of priorityPaths) {
      await revalidateWithRetry(path, 3, 2000);
    }

    // Revalidar el resto de rutas
    for (const path of remainingPaths) {
      await revalidateWithRetry(path, 2, 1000);
    }

    // Revalidación final después de un delay
    setTimeout(() => {
      priorityPaths.forEach((path) => revalidatePath(path));
    }, 5000);

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
