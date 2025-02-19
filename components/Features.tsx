import React from "react";
import { ProcessSection } from "@/types/contentful";
import dynamic from "next/dynamic";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultMarkdownComponents } from "./ui/markdown-components";
import { getTargetHref } from "@/lib/scroll-utils";
import { SectionLink } from "./ui/section-link";

// Definimos las props que aceptarán los íconos
interface IconProps {
  size?: number;
  className?: string;
}

// Componente de fallback para íconos no soportados
const FallbackIcon: React.FC<IconProps> = ({ className, size }) => (
  <span className={className} style={{ fontSize: 12 }}>
    Icono no soportado
  </span>
);

// Función que carga dinámicamente el ícono.
// Se usa dynamic<IconProps> para indicar que el componente cargado acepta IconProps.
const getDynamicIcon = (iconName: string | null) => {
  if (!iconName) return null;
  return dynamic<IconProps>(
    () =>
      import("lucide-react").then((mod) => {
        // Se castea el componente importado como React.ComponentType<IconProps>
        const Component = mod[iconName as keyof typeof mod] as
          | React.ComponentType<IconProps>
          | undefined;
        return { default: Component ? Component : FallbackIcon };
      }),
    { ssr: false }
  );
};

interface ProcessProps {
  content: ProcessSection;
}

export function Process({ content }: ProcessProps) {
  const { title, subtitle, steps, isVisible, sectionId } = content;

  if (!isVisible || !steps || steps.length === 0) return null;

  const validSteps = steps.filter(
    (step) => step.fields?.title && step.fields?.description
  );

  const getGridLayout = (numItems: number) => {
    let baseClasses = "grid gap-8 ";
    switch (numItems) {
      case 1:
        return baseClasses + "md:grid-cols-1 max-w-2xl mx-auto";
      case 2:
        return baseClasses + "md:grid-cols-2 max-w-4xl mx-auto";
      case 3:
        return baseClasses + "md:grid-cols-3";
      case 4:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-4";
      case 5:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-3";
      case 6:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-3";
      case 7:
        return baseClasses + "md:grid-cols-2 lg:grid-cols-3";
      case 8:
        return baseClasses + "md:grid-cols-3 lg:grid-cols-4";
      default:
        return baseClasses + "md:grid-cols-3";
    }
  };

  const getContainerWidth = (numItems: number) => {
    switch (numItems) {
      case 1:
        return "max-w-2xl";
      case 2:
        return "max-w-4xl";
      default:
        return "max-w-6xl";
    }
  };

  // Función para dividir los elementos en filas completas y elementos sobrantes
  const splitIntoRows = (items: any[]) => {
    const totalItems = items.length;
    if (totalItems <= 3) return { mainRows: items, remainingItems: [] };

    const remainingCount = totalItems % 3;
    if (remainingCount === 0) return { mainRows: items, remainingItems: [] };

    const mainRowsCount = totalItems - remainingCount;
    return {
      mainRows: items.slice(0, mainRowsCount),
      remainingItems: items.slice(mainRowsCount),
    };
  };

  const { mainRows, remainingItems } = splitIntoRows(validSteps);

  // Función para obtener las clases de la grid de elementos sobrantes
  const getRemainingGridClasses = (numItems: number) => {
    const baseClasses = "grid gap-8 mx-auto ";
    if (numItems === 1) {
      return baseClasses + "md:grid-cols-1 max-w-2xl";
    }
    return baseClasses + "md:grid-cols-2 max-w-4xl";
  };

  // Función para transformar nombres de íconos de Contentful a PascalCase
  const formatIconName = (icon: string) => {
    return icon
      .split("-") // Separa por guiones
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza cada palabra
      .join(""); // Une sin espacios
  };

  return (
    <section id={sectionId} className="py-24 relative">
      <div className="absolute inset-0 gradient-bg opacity-50" />
      <div
        className={`container max-w-6xl mx-auto px-4 ${getContainerWidth(
          validSteps.length
        )}`}
      >
        <div className="text-center mb-16 relative">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        {/* Grid principal para las filas completas */}
        <div className={`${getGridLayout(3)} max-w-6xl mx-auto relative mb-8`}>
          {mainRows.map((step) => {
            const iconName = step.fields?.icon
              ? formatIconName(step.fields.icon)
              : null;
            const IconComponent = getDynamicIcon(iconName);
            return (
              <div
                key={step?.sys?.id}
                className="group relative flex flex-col justify-between card-gradient rounded-lg p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
              >
                <div>
                  {IconComponent && (
                    <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                      <IconComponent size={48} className="text-primary" />
                    </div>
                  )}
                  <h3 className="text-xl font-semibold mb-4">
                    {step.fields.title}
                  </h3>
                  <div className="prose prose-invert max-w-none mb-8">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={defaultMarkdownComponents}
                    >
                      {step.fields.description}
                    </ReactMarkdown>
                  </div>
                </div>
                {step.fields.ctaText &&
                  (step.fields.ctaUrl || step.fields.ctaSection) && (
                    <div className="mt-6 pt-4 border-t border-border/10">
                      <SectionLink
                        href={getTargetHref(
                          step.fields.ctaSection,
                          step.fields.ctaUrl
                        )}
                        ctaSection={step.fields.ctaSection}
                        ctaUrl={step.fields.ctaUrl}
                        asLink={true}
                      >
                        {step.fields.ctaText}
                        <span className="ml-2 transition-transform group-hover:translate-x-1">
                          →
                        </span>
                      </SectionLink>
                    </div>
                  )}
              </div>
            );
          })}
        </div>

        {/* Grid separada para los elementos sobrantes */}
        {remainingItems.length > 0 && (
          <div className={getRemainingGridClasses(remainingItems.length)}>
            {remainingItems.map((step) => {
              const iconName = step.fields?.icon
                ? formatIconName(step.fields.icon)
                : null;
              const IconComponent = getDynamicIcon(iconName);
              return (
                <div
                  key={step?.sys?.id}
                  className="group relative flex flex-col justify-between card-gradient rounded-lg p-8 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
                >
                  <div>
                    {IconComponent && (
                      <div className="mb-6 transition-transform duration-300 group-hover:scale-110">
                        <IconComponent size={48} className="text-primary" />
                      </div>
                    )}
                    <h3 className="text-xl font-semibold mb-4">
                      {step.fields.title}
                    </h3>
                    <div className="prose prose-invert max-w-none mb-8">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={defaultMarkdownComponents}
                      >
                        {step.fields.description}
                      </ReactMarkdown>
                    </div>
                  </div>
                  {step.fields.ctaText &&
                    (step.fields.ctaUrl || step.fields.ctaSection) && (
                      <div className="mt-6 pt-4 border-t border-border/10">
                        <SectionLink
                          href={getTargetHref(
                            step.fields.ctaSection,
                            step.fields.ctaUrl
                          )}
                          ctaSection={step.fields.ctaSection}
                          ctaUrl={step.fields.ctaUrl}
                          asLink={true}
                        >
                          {step.fields.ctaText}
                          <span className="ml-2 transition-transform group-hover:translate-x-1">
                            →
                          </span>
                        </SectionLink>
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
