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


// Función para detectar si un string es un gradiente CSS
export function isGradient(value: string): boolean {
  if (!value) return false;
  return value.includes('gradient(') ||
    value.includes('linear-gradient(') ||
    value.includes('radial-gradient(') ||
    value.includes('conic-gradient(');
}

// Función para procesar el color/gradiente del texto
export function processTextStyle(
  colorValue?: string,
  defaultClass?: string
): { style?: React.CSSProperties; className: string } {
  if (!colorValue) {
    return { className: defaultClass || '' };
  }

  if (isGradient(colorValue)) {
    return {
      style: {
        backgroundImage: colorValue,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
      },
      className: defaultClass || ''
    };
  } else {
    // Es un color sólido
    return {
      style: { color: colorValue },
      className: defaultClass || ''
    };
  }
}

// Función para procesar gradientes de fondo
export const processGradient = (gradientValue?: string) => {
  // Si no hay valor, devolvemos el gradiente por defecto
  if (!gradientValue) {
    return "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7))";
  }

  // Limpiamos los espacios y separamos los valores
  const cleanedValue = gradientValue.replace(/\s/g, '');
  const parts = cleanedValue.split('-');

  // Procesamos el primer valor RGBA
  const firstRGBA = parts[0].split(',').map(part => part.trim());
  const firstColor = `rgba(${firstRGBA.slice(0, 4).join(', ')})`;

  // Si solo hay un valor, usamos el mismo para ambos
  if (parts.length === 1) {
    return `linear-gradient(${firstColor}, ${firstColor})`;
  }

  // Procesamos el segundo valor RGBA si existe
  const secondRGBA = parts[1].split(',').map(part => part.trim());
  const secondColor = `rgba(${secondRGBA.slice(0, 4).join(', ')})`;

  return `linear-gradient(${firstColor}, ${secondColor})`;
};

export function processBackgroundStyle(
  bgValue?: string,
  defaultClass?: string
): { style?: React.CSSProperties; className: string } {
  if (!bgValue) {
    return { className: defaultClass || '' };
  }

  if (isGradient(bgValue)) {
    return {
      style: { backgroundImage: bgValue },
      className: defaultClass || ''
    };
  } else {
    // Es un color sólido
    return {
      style: { backgroundColor: bgValue },
      className: defaultClass || ''
    };
  }
}