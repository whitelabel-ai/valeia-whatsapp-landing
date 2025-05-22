"use client";

import { PartnersSection } from "@/types/contentful";
import { useEffect, useRef, useState } from "react";

interface PartnersProps {
  content: PartnersSection;
}

export function Partners({ content }: PartnersProps) {
  const {
    title,
    subtitle,
    logos,
    displayMode = "grid",
    scrollSpeed = 1,
    height = 60,
    backgroundColor,
    isVisible,
    sectionId,
  } = content;

  const containerRef = useRef<HTMLDivElement>(null);
  const [logoElements, setLogoElements] = useState<JSX.Element[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const animationRef = useRef<number>();
  const positionRef = useRef(0);
  const requestRef = useRef<number>();
  const logosContainerRef = useRef<HTMLDivElement>(null);

  // Preparamos los logos para el carrusel
  useEffect(() => {
    if (!logos?.length) return;

    const validLogos = logos.filter(
      (logo) => logo?.fields?.file?.url && logo?.fields?.title
    );

    if (validLogos.length === 0) return;

    const elements = validLogos.map((logo, index) => (
      <div
        key={`logo-${logo.sys.id}-${index}`}
        className="flex-shrink-0 px-4 flex items-center justify-center"
      >
        <img
          src={`https:${logo.fields.file.url}`}
          alt={logo.fields.title}
          style={{ height: `${height}px`, maxWidth: '200px' }}
          className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
        />
      </div>
    ));

    setLogoElements(elements);
  }, [logos, height]);

  // Animación del carrusel infinito mejorado
  useEffect(() => {
    if (displayMode !== "carrusel" || !logosContainerRef.current || !logoElements.length) return;

    const container = logosContainerRef.current;
    const containerWidth = container.firstElementChild?.clientWidth || 0;
    const totalWidth = containerWidth * logoElements.length;
    let lastTimestamp = 0;
    let accumulatedDistance = 0;

    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isHovered) {
        const distance = (scrollSpeed * deltaTime) / 32; // Normalizado a 30fps
        accumulatedDistance += distance;

        // Mover el contenedor
        positionRef.current -= distance;
        container.style.transform = `translateX(${positionRef.current}px)`;

        // Reposicionamiento imperceptible cuando pasa un conjunto completo
        if (Math.abs(positionRef.current) >= totalWidth) {
          positionRef.current += totalWidth;
          container.style.transform = `translateX(${positionRef.current}px)`;
        }
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [displayMode, scrollSpeed, isHovered, logoElements]);

  if (!isVisible || !logos?.length) return null;

  const getBackgroundStyle = () => {
    if (!backgroundColor) return {};

    const hexToRgba = (hex: string, alpha: number) => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    return {
      background: `linear-gradient(135deg, 
        ${hexToRgba(backgroundColor, 0.15)}, 
        ${hexToRgba(backgroundColor, 0.05)}
      )`,
    };
  };

  return (
    <section
      id={sectionId}
      className="py-6 md:py-24 relative"
      style={getBackgroundStyle()}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {displayMode === "grid" ? (
          <div className="flex flex-wrap justify-center gap-4">
            {logos.map((logo, index) => (
              <div
                key={`logo-${logo.sys.id}-${index}`}
                className="flex items-center justify-center p-4 transition-transform hover:scale-105"
              >
                <img
                  src={`https:${logo.fields.file.url}`}
                  alt={logo.fields.title}
                  style={{ height: `${height}px` }}
                  className="object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="relative overflow-hidden py-4"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            ref={containerRef}
          >
            <div
              ref={logosContainerRef}
              className="flex items-center"
              style={{
                willChange: 'transform',
                width: 'fit-content'
              }}
            >
              {/* Renderizamos los logos 3 veces para fluidez */}
              {[...logoElements, ...logoElements, ...logoElements]}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}