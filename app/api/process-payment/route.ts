import { NextRequest, NextResponse } from "next/server";
import { createClient } from "contentful";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { planId, couponCode, discount, couponsEndpoint } = reqBody;

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
    const apiConfig = plan.apiConnection.fields; // Acceder a los campos del ConnectAPI
    if (!apiConfig) {
      return NextResponse.json(
        { error: "Configuración de API no encontrada" },
        { status: 400 }
      );
    }

    // Validar el cupón (si se proporciona)
    let finalAmount = extractPriceInfo(plan.price).amount;
    let appliedDiscount = 0;

    if (couponCode && couponCode !== "") {
      // Obtener el endpoint de cupones de la sección de precios
      const couponsEndpoint = plan.couponsEndpoint;
      if (!couponsEndpoint) {
        return NextResponse.json(
          { error: "Endpoint de cupones no configurado" },
          { status: 400 }
        );
      }
      console.log("cupon", couponCode);

      try {
        const couponUrl = `${couponsEndpoint}?coupon=${couponCode}&action=apply-coupon`;
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

    // Construir el cuerpo de la solicitud para dLocal
    const orderId =
      plan.name +
      "-" +
      finalAmount +
      "-" +
      Math.random().toString(36).substring(7); // Generar un ID único
    const requestBody = {
      amount: finalAmount,
      currency: extractPriceInfo(plan.price).currency,
      order_id: orderId,
    };

    // Configurar los encabezados de autorización
    const apiKey = apiConfig.apiKey;
    const secretKey = apiConfig.secretKey || process.env.DLOCAL_SECRET_KEY; // Obtener la clave secreta de las variables de entorno
    const authHeader = `Bearer ${apiKey}:${secretKey}`;

    // Llamar a la API de dLocal
    try {
      const dlocalResponse = await fetch(
        apiConfig.apiEndpoint + "v1/payments",
        {
          method: apiConfig.httpMethod,
          headers: {
            "Content-Type": "application/json",
            Authorization: authHeader,
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!dlocalResponse.ok) {
        const errorData = await dlocalResponse.json();
        console.error("dLocal API error:", errorData);
        return NextResponse.json(
          { error: "Error al procesar el pago con dLocal" },
          { status: 500 }
        );
      }

      const dlocalData = await dlocalResponse.json();

      // Extraer la URL de redirección desde la respuesta de dLocal
      const redirectUrl = dlocalData.redirect_url; // Ajusta esto según la respuesta de dLocal

      if (!redirectUrl) {
        return NextResponse.json(
          {
            error: "URL de redirección no encontrada en la respuesta de dLocal",
          },
          { status: 500 }
        );
      }

      // Devolver la URL de redirección al frontend
      return NextResponse.json({ redirectUrl: redirectUrl }, { status: 200 });
    } catch (dlocalError) {
      console.error("Error al llamar a la API de dLocal:", dlocalError);
      return NextResponse.json(
        { error: "Error al llamar a la API de dLocal" },
        { status: 500 }
      );
    }
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
