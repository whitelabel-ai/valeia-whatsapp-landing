import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { planId, couponCode, discount } = reqBody;

    // Inicializar cliente de Contentful
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });

    // Obtener el plan de precios desde Contentful
    const planResponse = await client.getEntry(planId);
    const plan = planResponse.fields as any;

    if (!plan) {
      return NextResponse.json(
        { error: "Plan de precios no encontrado" },
        { status: 404 }
      );
    }

    // Obtener la configuración de la API desde Contentful
    const apiConfig = plan.apiConnection; // Asumiendo que tienes un campo de referencia llamado "apiConnection"
    if (!apiConfig) {
      return NextResponse.json(
        { error: "Configuración de API no encontrada" },
        { status: 400 }
      );
    }

    // Validar el cupón (si se proporciona)
    let finalAmount = extractPriceInfo(plan.price).amount;
    let appliedDiscount = 0;

    if (couponCode === "HAS_COUPON" && discount > 0) {
      // Obtener el endpoint de cupones de la sección de precios
      const couponsEndpoint = plan.couponsEndpoint;
      if (!couponsEndpoint) {
        return NextResponse.json(
          { error: "Endpoint de cupones no configurado" },
          { status: 400 }
        );
      }

      try {
        const couponUrl =
          couponsEndpoint + "?coupon=" + couponCode + "&amount=" + finalAmount;
        const couponResponse = await fetch(couponUrl, {
          method: "GET",
          headers: {
            Accept: "*/*",
            "Accept-Encoding": "gzip, deflate, br",
            Connection: "keep-alive",
          },
          redirect: "follow",
        });

        const couponData = await couponResponse.json();

        if (couponData.valid) {
          appliedDiscount = couponData.discount;
          finalAmount = finalAmount - (finalAmount * appliedDiscount) / 100;
        } else {
          return NextResponse.json(
            { error: couponData.message || "Cupón inválido" },
            { status: 400 }
          );
        }
      } catch (couponError) {
        console.error("Error al validar el cupón:", couponError);
        return NextResponse.json(
          { error: "Error al validar el cupón" },
          { status: 500 }
        );
      }
    }

    // Construir la URL de redirección
    const redirectUrl = plan.payLink; // URL base del plan
    const currency = extractPriceInfo(plan.price).currency;

    // Devolver la URL de redirección al frontend
    return NextResponse.json({ redirectUrl: redirectUrl }, { status: 200 });
  } catch (error) {
    console.error("Error en la API Route:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function extractPriceInfo(priceString: string) {
  // Eliminar espacios extra y dividir en número y moneda
  const parts = priceString.trim().split(/\s+/);

  // Extraer el monto numérico (eliminar símbolos de moneda si existen)
  const amount = parseFloat(parts[0].replace(/[^0-9.]/g, ""));

  // Extraer la moneda (si existe, por defecto USD)
  const currency = parts[1] || "USD";

  return {
    amount,
    currency,
  };
}
