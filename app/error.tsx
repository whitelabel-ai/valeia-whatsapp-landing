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

  return (
    <>
      <main className="flex min-h-[80vh] items-center justify-center">
        <div className="container px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">Algo salió mal</h1>
          <p className="text-foreground/60 mb-8">
            Lo sentimos, ha ocurrido un error inesperado.
          </p>
          <Button onClick={reset}>Intentar de nuevo</Button>
        </div>
      </main>
    </>
  );
}
