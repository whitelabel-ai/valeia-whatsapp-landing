"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCoupon: (discount: number) => void;
  originalPrice: number;
  endpoint?: string;
}

export function CouponModal({
  isOpen,
  onClose,
  onApplyCoupon,
  originalPrice,
  endpoint,
}: CouponModalProps) {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      setError("Por favor ingresa un código de cupón");
      return;
    }

    if (!endpoint) {
      setError("No se ha configurado el endpoint para validar cupones");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const url = `${endpoint}?coupon=${couponCode}&action=apply-coupon`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "*/*",
          "Accept-Encoding": "gzip, deflate, br",
          Connection: "keep-alive",
        },
        redirect: "follow",
      });

      const data = await response.json();

      if (data.valid) {
        toast({
          title: "¡Cupón aplicado!",
          description:
            data.message || "El descuento ha sido aplicado correctamente.",
        });
        onApplyCoupon(data.discount * 100); // Convierte a porcentaje si es necesario
        onClose();
      } else {
        setError(data.message || "El cupón no es válido.");
      }
    } catch (err) {
      setError("Error al validar el cupón. Por favor intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Aplicar cupón de descuento</DialogTitle>
          <DialogDescription>
            Ingresa tu código de cupón para obtener un descuento en tu compra.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            placeholder="Ingresa tu código"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            className="uppercase"
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={validateCoupon} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Aplicar cupón
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
