"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <main className="flex min-h-screen items-center justify-center">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-bold mb-4">Error crítico</h1>
            <p className="text-foreground/60 mb-8">
              Lo sentimos, ha ocurrido un error crítico en la aplicación.
            </p>
            <Button onClick={reset}>Reiniciar aplicación</Button>
          </div>
        </main>
      </body>
    </html>
  );
}
