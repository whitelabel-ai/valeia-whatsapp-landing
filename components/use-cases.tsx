"use client";

import { useState } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { UseCasesSection } from "@/types/contentful";

interface UseCasesProps {
  content: UseCasesSection;
}

type ImagePosition = "left" | "right" | "top" | "bottom";
type SlideDirection = "left" | "right";

export function UseCases({ content }: UseCasesProps) {
  const { title, subtitle, cases, sectionId, isVisible } = content;
  const [selectedCase, setSelectedCase] = useState(
    cases.find((c) => c.fields.isActive)?.sys.id || cases[0].sys.id
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>("left");

  if (!isVisible) return null;
  if (!content || !content.isVisible) return null;

  const activeCases = cases.filter((c) => c.fields?.isActive);
  const selectedCaseData = cases.find((c) => c.sys.id === selectedCase)?.fields;

  const computedImageWidth = (width: number | undefined) =>
    typeof width === "number" && width > 0 ? width : 400;

  const getLayoutClasses = (imagePosition: ImagePosition = "right") => {
    const positions = {
      right: "flex-row-reverse items-center",
      left: "flex-row items-center",
      top: "flex-col",
      bottom: "flex-col-reverse ",
    };
    return positions[imagePosition];
  };

  const getImageSizeClasses = (imagePosition: ImagePosition) => {
    const sizes = {
      right: "w-full md:w-1/2",
      left: "w-full md:w-1/2",
      top: "w-full",
      bottom: "w-full",
    };
    return sizes[imagePosition];
  };

  const handleSlideChange = (index: number) => {
    setDirection(index > currentSlide ? "left" : "right");
    setCurrentSlide(index);
    setSelectedCase(activeCases[index].sys.id);
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const SWIPE_THRESHOLD = 120;
    const SWIPE_VELOCITY = 0.7;

    if (
      Math.abs(info.offset.x) > SWIPE_THRESHOLD ||
      Math.abs(info.velocity.x) > SWIPE_VELOCITY
    ) {
      if (info.offset.x > 0 || info.velocity.x > 0) {
        if (currentSlide > 0) {
          setDirection("right");
          setCurrentSlide((prev) => prev - 1);
          setSelectedCase(activeCases[currentSlide - 1].sys.id);
        }
      } else {
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

  const CaseContent = ({ caseData, showTitle = true }: { caseData: any; showTitle?: boolean }) => {
    const hasImage = caseData.image?.fields?.file?.url;
    const hasDescription = caseData.description;
    const imagePosition = hasImage ? (caseData.imagePosition as ImagePosition || "right") : "right";

    // Determinar el padding top del contenedor principal
    const getContainerPadding = () => {
      if (!showTitle) return 'pt-0'; // No mostrar padding si no hay título
      if (imagePosition === 'top') return 'pt-6'; // Padding si la imagen está arriba
      return 'pt-6'; // padding por defecto
    };

    return (
      <motion.div className={`card-gradient rounded-lg p-6 relative overflow-hidden ${getContainerPadding()}`}>
        {showTitle && <h3 className="text-2xl font-bold ">{caseData.name}</h3>}

        {hasImage && hasDescription ? (
          <div className={`flex ${getLayoutClasses(imagePosition)} gap-6`}>
            <div className={`${getImageSizeClasses(imagePosition)} flex-shrink-0 ${imagePosition === 'top' || imagePosition === 'bottom' ? 'flex justify-center' : ''
              }`}>
              <img
                src={`https:${caseData.image.fields.file.url}`}
                alt={caseData.image.fields.title || "Case Image"}
                className={`rounded-lg shadow-lg w-full h-auto object-cover transition-shadow duration-300 hover:shadow-xl ${imagePosition === 'top' || imagePosition === 'bottom' ? 'max-w-2xl' : ''
                  }`}
                style={{
                  maxWidth: computedImageWidth(caseData.imageWidth),
                  maxHeight: imagePosition === "left" || imagePosition === "right" ? "400px" : "auto"
                }}
              />
            </div>
            <div className="prose prose-invert max-w-none flex-1 mt-0">
              <div className="text-foreground/80">
                {documentToReactComponents(caseData.description)}
              </div>
            </div>
          </div>
        ) : hasImage ? (
          <div className="flex justify-center">
            <img
              src={`https:${caseData.image.fields.file.url}`}
              alt={caseData.image.fields.title || "Case Image"}
              className="rounded-lg shadow-lg w-full max-w-2xl h-auto object-cover transition-shadow duration-300 hover:shadow-xl"
              style={{
                maxWidth: computedImageWidth(caseData.imageWidth),
              }}
            />
          </div>
        ) : hasDescription ? (
          <div className="prose prose-invert max-w-none">
            <div className="text-foreground/80">
              {documentToReactComponents(caseData.description)}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-foreground/60">
            "No content available for this case."
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <section id={sectionId} className="py-6 md:py-24 relative max-w-6xl mx-auto">
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
                className={`w-full text-left p-4 rounded-lg transition-all duration-300 ${selectedCase === useCase.sys.id
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
                    className={`font-medium ${selectedCase === useCase.sys.id
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
                  <CaseContent caseData={selectedCaseData} showTitle={false} />
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
              dragElastic={0.1}
              onDragEnd={handleDragEnd}
            >
              <CaseContent caseData={activeCases[currentSlide].fields} showTitle={true} />
            </motion.div>
          </AnimatePresence>

          {/* Dots Navigation */}
          {activeCases.length > 1 && (
            <div className="flex justify-center gap-3 mt-6 sticky bottom-4 z-10">
              {activeCases.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleSlideChange(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 flex items-center justify-center ${currentSlide === index ? "bg-primary w-6" : "bg-primary/30 hover:bg-primary/50"
                    }`}
                  aria-label={`Go to case ${index + 1}`}
                >
                  {currentSlide === index && (
                    <span className="w-2 h-2 bg-white rounded-full"></span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Indicador de swipe (solo se muestra en el primer render) 
          <div className="text-center mt-4 text-sm text-foreground/60 animate-pulse">
            Desliza para navegar
          </div>
          */}

        </div>
      </div>
    </section>
  );
}