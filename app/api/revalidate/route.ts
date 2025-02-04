import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

// Helper function to get the path to revalidate based on Contentful entry
function getPathToRevalidate(
  contentType: string,
  slug: string | undefined
): string {
  switch (contentType) {
    case "dynamicPage":
      return slug ? `/${slug}` : "/";
    case "landingPage":
      return "/";
    case "blogPost":
      return slug ? `/blog/${slug}` : "/blog";
    default:
      return "/";
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

    const path = getPathToRevalidate(contentType, slug);
    console.log("🛤️ [Webhook] Ruta a revalidar:", path);

    revalidatePath(path);
    console.log("✅ [Webhook] Ruta revalidada:", path);

    if (path !== "/") {
      revalidatePath("/");
      console.log("🔄 [Webhook] También se revalidó la ruta raíz: /");
    }

    return NextResponse.json(
      {
        message: "Revalidación exitosa",
        revalidated: path,
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
