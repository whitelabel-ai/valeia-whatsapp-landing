// Función para convertir HEX a HSL
export function hexToHSL(hex: string) {
  // Remover el # si existe
  hex = hex.replace("#", "");

  // Convertir a RGB
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

// Función para generar gradientes basados en colores primarios
export function generateGradients(primaryColor: string, accentColor: string) {
  return {
    cardGradient: `linear-gradient(135deg, 
      ${primaryColor}33, 
      ${accentColor}1A
    ), 
    linear-gradient(to bottom,
      rgba(255, 255, 255, 0.05),
      rgba(0, 0, 0, 0.05)
    )`,
    textGradient: `linear-gradient(to right, ${primaryColor}, ${accentColor})`,
    backgroundGradient: `
      radial-gradient(circle at center, 
        ${primaryColor}26, 
        transparent 70%
      )
    `,
  };
}
