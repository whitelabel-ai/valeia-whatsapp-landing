"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { UseCasesSection } from "@/types/contentful";

interface UseCasesProps {
  content: UseCasesSection;
}

type ImagePosition = "right" | "left" | "top" | "bottom" | "background";

export function UseCases({ content }: UseCasesProps) {
  const { title, subtitle, cases, isVisible } = content;
  const [selectedCase, setSelectedCase] = useState(
    cases.find((c) => c.fields.isActive)?.sys.id || cases[0]?.sys.id
  );

  if (!isVisible) return null;

  const activeCases = cases.filter((c) => c.fields.isActive);
  const selectedCaseData = cases.find((c) => c.sys.id === selectedCase)?.fields;

  // Compute image width with default if not provided
  const computedImageWidth = (width: number | undefined) =>
    typeof width === "number" && width > 0 ? width : 400;

  // Determine layout classes based on image position
  const getLayoutClasses = (imagePosition: ImagePosition = "right") => {
    const positions = {
      right: "flex-row-reverse items-center",
      left: "flex-row items-center",
      top: "flex-col items-center",
      bottom: "flex-col-reverse items-center",
      background: "flex-col items-center",
    };
    return positions[imagePosition];
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        <div className="grid md:grid-cols-12 gap-8">
          {/* Case list */}
          <div className="md:col-span-4 space-y-2">
            {activeCases.map((useCase) => (
              <button
                key={useCase.sys.id}
                onClick={() => setSelectedCase(useCase.sys.id)}
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${
                  selectedCase === useCase.sys.id
                    ? "bg-primary/10 border-l-4 border-primary"
                    : "hover:bg-muted"
                }`}
                style={{
                  borderColor:
                    selectedCase === useCase.sys.id
                      ? useCase.fields.accentColor
                      : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  {useCase.fields.icon && (
                    <img
                      src={`https:${useCase.fields.icon.fields.file.url}`}
                      alt={useCase.fields.icon.fields.title}
                      className="w-8 h-8 object-contain"
                    />
                  )}
                  <span
                    className={`font-medium ${
                      selectedCase === useCase.sys.id
                        ? "text-primary"
                        : "text-foreground/80"
                    }`}
                    style={{
                      color:
                        selectedCase === useCase.sys.id
                          ? useCase.fields.accentColor
                          : undefined,
                    }}
                  >
                    {useCase.fields.name}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Selected case content */}
          <div className="md:col-span-8">
            <AnimatePresence mode="wait">
              {selectedCaseData && (
                <motion.div
                  key={selectedCase}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`card-gradient rounded-lg p-6 relative overflow-hidden ${
                    selectedCaseData.imagePosition === "background"
                      ? "min-h-[400px]"
                      : ""
                  }`}
                  style={
                    selectedCaseData.image?.fields?.file?.url &&
                    selectedCaseData.imagePosition === "background"
                      ? {
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https:${selectedCaseData.image.fields.file.url})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }
                      : {}
                  }
                >
                  {/* Title always at the top */}
                  <h3 className="text-2xl font-bold mb-6 relative z-10">
                    {selectedCaseData.name}
                  </h3>

                  {selectedCaseData.image?.fields?.file?.url ? (
                    selectedCaseData.imagePosition === "background" ? (
                      // Content for background image
                      <div className="prose prose-invert max-w-none relative z-10">
                        <div className="text-foreground/80">
                          {documentToReactComponents(
                            selectedCaseData.description
                          )}
                        </div>
                      </div>
                    ) : (
                      // Content with positioned image
                      <div
                        className={`flex ${getLayoutClasses(
                          selectedCaseData.imagePosition as ImagePosition
                        )} gap-6`}
                      >
                        <img
                          src={`https:${selectedCaseData.image.fields.file.url}`}
                          alt={
                            selectedCaseData.image.fields.title || "Case Image"
                          }
                          className="rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
                          style={{
                            width: computedImageWidth(
                              selectedCaseData.imageWidth
                            ),
                          }}
                        />
                        <div className="prose prose-invert max-w-none flex-1">
                          <div className="text-foreground/80">
                            {documentToReactComponents(
                              selectedCaseData.description
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  ) : (
                    // Content without image
                    <div className="prose prose-invert max-w-none">
                      <div className="text-foreground/80">
                        {documentToReactComponents(
                          selectedCaseData.description
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
