import { MouseEvent } from "react";

export const handleSectionScroll = (
  e: MouseEvent<HTMLAnchorElement>,
  ctaSection?: string,
  ctaUrl?: string
) => {
  // Si no hay ctaSection, permitir el comportamiento normal del enlace
  if (!ctaSection) return true;

  // Prevenir la navegación por defecto
  e.preventDefault();

  // Encontrar el elemento de la sección
  const element = document.getElementById(ctaSection);
  if (!element) {
    // Si no se encuentra la sección y hay una URL, navegar a ella
    if (ctaUrl) {
      window.location.href = ctaUrl;
    }
    return;
  }

  // Calcular la posición de scroll
  const offset = 80; // Offset para el header fijo
  const elementPosition = element.getBoundingClientRect().top;
  const offsetPosition = elementPosition + window.pageYOffset - offset;

  // Realizar el scroll suave
  window.scrollTo({
    top: offsetPosition,
    behavior: "smooth",
  });
};

// Función auxiliar para construir el href
export const getTargetHref = (ctaSection?: string, ctaUrl?: string): string => {
  if (ctaSection) {
    return `#${ctaSection}`;
  }
  return ctaUrl || "#";
};
