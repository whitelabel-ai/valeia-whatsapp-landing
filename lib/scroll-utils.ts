export const getTargetHref = (ctaSection?: string, ctaUrl?: string): string => {
  if (ctaSection) {
    return `#${ctaSection}`;
  }
  return ctaUrl || "#";
};
