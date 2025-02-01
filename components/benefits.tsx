"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BenefitsSection } from "@/types/contentful";
import { Button } from "./ui/button";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BenefitsProps {
  content: BenefitsSection;
}

export function Benefits({ content }: BenefitsProps) {
  const { title, subtitle, benefits, isVisible, backgroundColor, accentColor } =
    content;

  const [activeBenefit, setActiveBenefit] = useState(0);

  if (!isVisible) return null;

  // Función para generar el estilo del fondo basado en el tema y el color personalizado
  const getBackgroundStyle = () => {
    if (!backgroundColor) return {};

    // Convertir el color hex a rgba para usarlo en gradientes
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
    <section className="py-24 relative" style={getBackgroundStyle()}>
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 text-lg max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Pestañas */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <div className="card-gradient rounded-full p-1 flex gap-2">
              {benefits?.map((benefit, index) => (
                <button
                  key={benefit.sys.id}
                  onClick={() => setActiveBenefit(index)}
                  className={cn(
                    "px-6 py-2 rounded-full transition-all duration-300",
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

          {/* Content Area */}
          <AnimatePresence mode="wait">
            {benefits?.map((benefit, index) => {
              if (index !== activeBenefit) return null;

              const imagePosition = benefit.fields.imagePosition || "right";

              return (
                <motion.div
                  key={benefit.sys.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="card-gradient rounded-lg p-12"
                >
                  <div
                    className={cn(
                      "grid gap-12 items-center",
                      imagePosition === "right"
                        ? "md:grid-cols-[1fr,1.2fr]"
                        : "md:grid-cols-[1.2fr,1fr]"
                    )}
                  >
                    {/* Content Side */}
                    <div className="flex flex-col justify-between h-full space-y-6 ">
                      <div>
                        <h3 className="text-2xl font-bold mb-4 ">
                          {benefit.fields.title}
                        </h3>
                        <p className="text-foreground/80 text-lg">
                          {benefit.fields.description}
                        </p>

                        {/* Features List */}
                        {benefit.fields.features &&
                          benefit.fields.features.length > 0 && (
                            <ul className="space-y-3 mt-4">
                              {benefit.fields.features.map((feature, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-3"
                                >
                                  <div className="mt-1">
                                    <Check
                                      className="h-5 w-5"
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
                          {benefit.fields.ctaText && benefit.fields.ctaUrl && (
                            <Button
                              asChild
                              style={
                                accentColor
                                  ? { backgroundColor: accentColor }
                                  : undefined
                              }
                            >
                              <Link href={benefit.fields.ctaUrl}>
                                {benefit.fields.ctaText}
                              </Link>
                            </Button>
                          )}
                          {benefit.fields.secondaryCtaText &&
                            benefit.fields.secondaryCtaUrl && (
                              <Button variant="outline" asChild>
                                <Link href={benefit.fields.secondaryCtaUrl}>
                                  {benefit.fields.secondaryCtaText}
                                </Link>
                              </Button>
                            )}
                        </div>
                      )}
                    </div>

                    {/* Image Side */}
                    {benefit.fields.image && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.1, delay: 0.2 }}
                        className={cn(
                          "relative aspect-[4/3] w-full",
                          imagePosition === "left"
                            ? "order-first"
                            : "order-last"
                        )}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-background/70 to-background/60 rounded-xl backdrop-blur-[5px]">
                          <div className="absolute inset-0 border rounded-xl">
                            <img
                              src={`https:${benefit.fields.image.fields.file.url}`}
                              alt={
                                benefit.fields.image.fields.title ||
                                benefit.fields.title
                              }
                              className="w-full h-full object-cover rounded-xl"
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
