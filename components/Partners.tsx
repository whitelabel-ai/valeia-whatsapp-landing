"use client";

import { PartnersSection } from "@/types/contentful";
import { useEffect, useRef } from "react";

interface PartnersProps {
  content: PartnersSection;
}

export function Partners({ content }: PartnersProps) {
  const {
    title,
    subtitle,
    logos,
    isVisible,
    displayMode = "grid",
    scrollSpeed = 30,
    height = 60,
  } = content;

  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayMode !== "scroll" || !scrollRef.current || !containerRef.current)
      return;

    const scrollContainer = scrollRef.current;
    const container = containerRef.current;
    let scrollPos = -0;
    let animationFrameId: number;

    const resetScroll = () => {
      if (scrollPos >= container.offsetWidth / 3) {
        scrollPos = 0;
        scrollContainer.style.transform = `translateX(20)`;
      }
    };

    const scroll = () => {
      scrollPos += scrollSpeed / 60;
      scrollContainer.style.transform = `translateX(-${scrollPos}px)`;
      resetScroll();
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [displayMode, scrollSpeed]);

  if (!isVisible || !logos?.length) return null;

  const renderLogos = () => {
    const logoElements = logos.map((logo, index) => (
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
    ));

    // For scroll mode, we create three sets of logos for smooth infinite scroll
    if (displayMode === "scroll") {
      return logoElements.concat(
        logoElements.map((el, i) => ({
          ...el,
          key: `logo-scroll-1-${i}`,
        })),
        logoElements.map((el, i) => ({
          ...el,
          key: `logo-scroll-2-${i}`,
        }))
      );
    }

    return logoElements;
  };

  return (
    <section className="py-24 relative bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div ref={containerRef} className="overflow-hidden">
          <div
            ref={scrollRef}
            className={`flex ${
              displayMode === "scroll"
                ? "whitespace-nowrap"
                : "flex-wrap justify-center"
            }`}
            style={{
              transition:
                displayMode === "scroll" ? "transform 0.05s linear" : undefined,
            }}
          >
            {renderLogos()}
          </div>
        </div>
      </div>
    </section>
  );
}
