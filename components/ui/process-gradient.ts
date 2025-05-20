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