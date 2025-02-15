"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BenefitsSection } from "@/types/contentful";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { getTargetHref, handleSectionScroll } from "@/lib/scroll-utils";

interface BenefitsProps {
  content: BenefitsSection;
}

export function Benefits({ content }: BenefitsProps) {
  const {
    title,
    subtitle,
    benefits,
    isVisible,
    backgroundColor,
    accentColor,
    sectionId,
  } = content;

  const [activeBenefit, setActiveBenefit] = useState(0);

  if (!isVisible) return null;

  const validBenefits = benefits?.filter(
    (benefit) => benefit.fields?.title && benefit.fields?.description
  );

  if (!validBenefits || validBenefits.length === 0) return null;

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

  const getAspectRatioClass = (ratio?: string) => {
    switch (ratio) {
      case "16:9":
        return "aspect-[16/9]";
      case "4:3":
        return "aspect-[4/3]";
      case "1:1":
        return "aspect-square";
      case "9:16":
        return "aspect-[9/16]";
      case "auto":
      default:
        return "aspect-auto";
    }
  };

  const getObjectFitClass = (fit?: string) => {
    switch (fit) {
      case "Ajustar":
        return "object-contain";
      case "Rellenar":
        return "object-fill";
      case "none":
        return "object-none";
      case "Expandir":
        return "object-cover";
      default:
        return "object-none";
    }
  };

  return (
    <section
      id={sectionId}
      className="py-24 relative"
      style={getBackgroundStyle()}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="mx-auto">
          <div
            className={cn(
              "flex mb-8 overflow-x-auto pb-4 md:pb-0 md:overflow-x-visible md:mx-0 md:px-0",
              validBenefits.length <= 2
                ? "justify-center"
                : "justify-start md:justify-center"
            )}
          >
            <div className="card-gradient rounded-full p-1 flex gap-2 min-w-max">
              {validBenefits.map((benefit, index) => (
                <button
                  key={benefit.sys.id}
                  onClick={() => setActiveBenefit(index)}
                  className={cn(
                    "px-6 py-2 rounded-full transition-all duration-300 whitespace-nowrap",
                    activeBenefit === index
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted/50"
                  )}
                  style={
                    activeBenefit === index && accentColor
                      ? { backgroundColor: accentColor }
                      : undefined
                  }
                >
                  {benefit.fields.tabLabel || `Beneficio ${index + 1}`}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {validBenefits.map((benefit, index) => {
              if (index !== activeBenefit) return null;

              const imagePosition = benefit.fields.imagePosition || "right";
              const aspectRatio = benefit.fields.imageAspectRatio || "4:3";
              const imageFit = benefit.fields.imageFit || "Rellenar";
              const imageHeight = benefit.fields.imageHeight || 300;
              const isVertical = aspectRatio === "9:16";
              const hasImage = !!benefit.fields.image;

              return (
                <motion.div
                  key={benefit.sys.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={cn(
                    "card-gradient rounded-lg p-8 md:p-12 mx-auto",
                    hasImage ? "max-w-6xl" : "max-w-2xl"
                  )}
                >
                  <div
                    className={cn(
                      "grid gap-8 md:gap-12 items-center justify-center",
                      hasImage
                        ? imagePosition === "right"
                          ? isVertical
                            ? "md:grid-cols-[2fr,1fr]"
                            : "md:grid-cols-[1fr,1.2fr]"
                          : isVertical
                            ? "md:grid-cols-[1fr,2fr]"
                            : "md:grid-cols-[1.2fr,1fr]"
                        : "grid-cols-1",
                      "grid-cols-1"
                    )}
                  >
                    {/* Content Side */}
                    <div className="flex flex-col justify-between h-full space-y-6">
                      <div>
                        <h3 className="text-2xl font-bold mb-4">
                          {benefit.fields.title}
                        </h3>
                        <div className="prose prose-invert max-w-none mb-6">
                          {documentToReactComponents(
                            benefit.fields.description
                          )}
                        </div>
                        {/* Features List */}
                        {benefit.fields.features &&
                          benefit.fields.features.length > 0 && (
                            <ul className="space-y-3 mt-6">
                              {benefit.fields.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="mt-1">
                                    <Check
                                      className="h-5 w-5 text-primary mt-0.5 flex-shrink-0"
                                      style={
                                        accentColor
                                          ? { color: accentColor }
                                          : undefined
                                      }
                                    />
                                  </div>
                                  <span className="text-foreground/80">
                                    {feature}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          )}
                      </div>
                      {/* CTA Buttons */}
                      {(benefit.fields.ctaText ||
                        benefit.fields.secondaryCtaText) && (
                        <div className="flex flex-wrap gap-4 pt-4">
                          {(benefit.fields.ctaText && benefit.fields.ctaUrl) ||
                            (benefit.fields.ctaSection && (
                              <Button
                                asChild
                                style={
                                  accentColor
                                    ? { backgroundColor: accentColor }
                                    : undefined
                                }
                                className="w-full md:w-auto"
                              >
                                <Link
                                  href={getTargetHref(
                                    benefit.fields.ctaSection,
                                    benefit.fields.ctaUrl
                                  )}
                                  onClick={(e) =>
                                    handleSectionScroll(
                                      e,
                                      benefit.fields.ctaSection,
                                      benefit.fields.ctaUrl
                                    )
                                  }
                                >
                                  {benefit.fields.ctaText}
                                </Link>
                              </Button>
                            ))}
                          {(benefit.fields.secondaryCtaText &&
                            benefit.fields.secondaryCtaUrl) ||
                            (benefit.fields.ctaSection && (
                              <Button
                                variant="outline"
                                asChild
                                className="w-full md:w-auto"
                              >
                                <Link
                                  href={getTargetHref(
                                    benefit.fields.ctaSection,
                                    benefit.fields.secondaryCtaUrl
                                  )}
                                  onClick={(e) =>
                                    handleSectionScroll(
                                      e,
                                      benefit.fields.ctaSection,
                                      benefit.fields.secondaryCtaUrl
                                    )
                                  }
                                >
                                  {benefit.fields.secondaryCtaText}
                                </Link>
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                    {/* Image Side */}
                    {hasImage && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.1, delay: 0.2 }}
                        className={cn(
                          "relative w-full flex items-center justify-center place-self-center",
                          getAspectRatioClass(aspectRatio),
                          "order-last"
                        )}
                        style={{
                          height: `${imageHeight}px`,
                        }}
                      >
                        <div className="">
                          <div className="absolute inset-0 rounded-xl overflow-hidden">
                            <img
                              src={`https:${benefit.fields.image?.fields.file.url}`}
                              alt={
                                benefit.fields.image?.fields.title ||
                                benefit.fields.title
                              }
                              className={cn(
                                "w-full h-full transition-transform duration-300 group-hover:scale-105",
                                getObjectFitClass(imageFit)
                              )}
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
