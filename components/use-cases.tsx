"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { UseCasesSection } from "@/types/contentful";

interface UseCasesProps {
  content: UseCasesSection;
}

type ImagePosition = "right" | "left" | "top" | "bottom" | "background";
type SlideDirection = "left" | "right";

export function UseCases({ content }: UseCasesProps) {
  const { title, subtitle, cases, isVisible } = content;
  const [selectedCase, setSelectedCase] = useState(
    cases.find((c) => c.fields.isActive)?.sys.id || cases[0].sys.id
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>("left");

  if (!isVisible) return null;

  const activeCases = cases.filter((c) => c.fields?.isActive);
  const selectedCaseData = cases.find((c) => c.sys.id === selectedCase)?.fields;

  const computedImageWidth = (width: number | undefined) =>
    typeof width === "number" && width > 0 ? width : 400;

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

  const handleSlideChange = (index: number) => {
    // Determinar la dirección del cambio
    setDirection(index > currentSlide ? "left" : "right");
    setCurrentSlide(index);
    setSelectedCase(activeCases[index].sys.id);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const SWIPE_THRESHOLD = 50;
    const SWIPE_VELOCITY = 0.5;

    if (
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY
    ) {
      if (info.offset.x > 0 || info.velocity.x > 0) {
        // Swipe derecha (caso anterior)
        if (currentSlide > 0) {
          setDirection("right");
          setCurrentSlide((prev) => prev - 1);
          setSelectedCase(activeCases[currentSlide - 1].sys.id);
        }
      } else {
        // Swipe izquierda (siguiente caso)
        if (currentSlide < activeCases.length - 1) {
          setDirection("left");
          setCurrentSlide((prev) => prev + 1);
          setSelectedCase(activeCases[currentSlide + 1].sys.id);
        }
      }
    }
  };

  const slideVariants = {
    enter: (direction: SlideDirection) => {
      return {
        x: direction === "left" ? "100%" : "-100%",
        opacity: 0,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: SlideDirection) => {
      return {
        zIndex: 0,
        x: direction === "left" ? "-100%" : "100%",
        opacity: 0,
      };
    },
  };

  const CaseContent = ({ caseData }: { caseData: any }) => (
    <motion.div
      className={`card-gradient rounded-lg p-6 relative overflow-hidden ${
        caseData.imagePosition === "background" ? "min-h-[400px]" : ""
      }`}
      style={
        caseData.image?.fields?.file?.url &&
        caseData.imagePosition === "background"
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https:${caseData.image.fields.file.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      <h3 className="text-2xl font-bold mb-6 relative z-10">{caseData.name}</h3>

      {caseData.image?.fields?.file?.url ? (
        caseData.imagePosition === "background" ? (
          <div className="prose prose-invert max-w-none relative z-10">
            <div className="text-foreground/80">
              {documentToReactComponents(caseData.description)}
            </div>
          </div>
        ) : (
          <div
            className={`flex ${getLayoutClasses(
              caseData.imagePosition as ImagePosition
            )} gap-6`}
          >
            <img
              src={`https:${caseData.image.fields.file.url}`}
              alt={caseData.image.fields.title || "Case Image"}
              className="rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
              style={{
                width: computedImageWidth(caseData.imageWidth),
              }}
            />
            <div className="prose prose-invert max-w-none flex-1">
              <div className="text-foreground/80">
                {documentToReactComponents(caseData.description)}
              </div>
            </div>
          </div>
        )
      ) : (
        <div className="prose prose-invert max-w-none">
          <div className="text-foreground/80">
            {documentToReactComponents(caseData.description)}
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <section className="py-24 relative max-w-6xl mx-auto">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          {subtitle && (
            <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-12 gap-8">
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

          <div className="md:col-span-8">
            <AnimatePresence mode="wait" custom={direction}>
              {selectedCaseData && (
                <motion.div
                  key={selectedCase}
                  custom={direction}
                  initial={{ opacity: 0, x: direction === "left" ? 100 : -100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction === "left" ? -100 : 100 }}
                  transition={{ duration: 0.3 }}
                >
                  <CaseContent caseData={selectedCaseData} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Layout with Swipe */}
        <div className="md:hidden">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={currentSlide}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
            >
              <CaseContent caseData={activeCases[currentSlide].fields} />
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {activeCases.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "bg-primary w-4" : "bg-primary/30"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
