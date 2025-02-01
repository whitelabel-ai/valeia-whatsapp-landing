"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const handleWhatsAppContact = () => {
    const phoneNumber = "573045809637";
    const message = encodeURIComponent(
      "Hola, estoy experimentando el siguiente error: " + getErrorMessage()
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  // Determinar el mensaje de error apropiado
  const getErrorMessage = () => {
    if (error.message.includes("Credenciales de Contentful")) {
      return "Error de configuración: Las credenciales de Contentful no están configuradas correctamente.";
    }
    if (error.message.includes("conexión con el sistema de contenido")) {
      return "No se pudo establecer conexión con el sistema de contenido. Por favor, verifique su conexión a internet e inténtelo de nuevo.";
    }
    if (error.message.includes("configuración de la página principal")) {
      return "No se encontró la configuración del sitio. Por favor, asegúrese de que el contenido esté publicado en Contentful.";
    }
    return error.message || "Lo sentimos, ha ocurrido un error inesperado.";
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background">
      <div className="container px-4 text-center">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Error del Sistema
        </h1>
        <p className="text-foreground/60 mb-8">{getErrorMessage()}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button onClick={reset} variant="default">
            Intentar de nuevo
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline">
            Recargar página
          </Button>
          <Button
            onClick={handleWhatsAppContact}
            variant="outline"
            className="bg-green-600 text-white hover:bg-green-700"
          >
            Contactar a Soporte
          </Button>
        </div>
      </div>
    </main>
  );
}
