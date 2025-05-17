"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { UseCasesSection } from "@/types/contentful";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface UseCasesProps {
  content: UseCasesSection;
}

type ImagePosition = "right" | "left" | "top" | "bottom" | "background";
type SlideDirection = "left" | "right";

export function UseCases({ content }: UseCasesProps) {
  // Constantes para mobile
  const MOBILE_CARD_HEIGHT = "500px";
  const AUTO_SCROLL_DELAY = 1000; // 1 segundo para mejor experiencia
  const SCROLL_THRESHOLD = 50; // Margen para detectar el final del scroll
  const DEBOUNCE_TIME = 100; // Tiempo para evitar múltiples llamadas al scroll handler

  const { title, subtitle, cases, sectionId, isVisible } = content;
  const [selectedCase, setSelectedCase] = useState(
    cases.find((c) => c.fields.isActive)?.sys.id || cases[0].sys.id
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>("left");
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);
  const autoScrollTimeout = useRef<NodeJS.Timeout>();
  const isChangingRef = useRef(false);
  const touchStartY = useRef(0);
  const touchEndY = useRef(0);
  const lastScrollTime = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

  const activeCases = cases.filter((c) => c.fields?.isActive);
  const selectedCaseData = cases.find((c) => c.sys.id === selectedCase)?.fields;
  const isLastSlide = currentSlide === activeCases.length - 1;

  // Detectamos si es mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px es el breakpoint típico para md en Tailwind
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Configuramos el scroll automático solo para mobile
  useEffect(() => {
    if (!isMobile) return;

    const currentRef = contentRefs.current[currentSlide];
    if (currentRef) {
      const checkScrollable = () => {
        const isScrollable = currentRef.scrollHeight > currentRef.clientHeight;
        setShowScrollIndicator(isScrollable && !isLastSlide);
      };

      const handleScroll = (e: Event) => {
        if (isChangingRef.current) return;

        const now = Date.now();
        if (now - lastScrollTime.current < DEBOUNCE_TIME) return;
        lastScrollTime.current = now;

        const target = e.target as HTMLDivElement;
        const { scrollTop, scrollHeight, clientHeight } = target;
        const isBottom = scrollHeight - (scrollTop + clientHeight) <= SCROLL_THRESHOLD;

        setIsAtBottom(isBottom);

        // Cancelar cualquier cambio pendiente si el usuario está interactuando
        clearTimeout(autoScrollTimeout.current);

        if (isBottom && !isLastSlide) {
          autoScrollTimeout.current = setTimeout(() => {
            // Verificar nuevamente si estamos en el fondo después del delay
            const currentScrollPos = contentRefs.current[currentSlide]?.scrollTop || 0;
            const currentScrollHeight = contentRefs.current[currentSlide]?.scrollHeight || 0;
            const currentClientHeight = contentRefs.current[currentSlide]?.clientHeight || 0;
            const stillAtBottom = currentScrollHeight - (currentScrollPos + currentClientHeight) <= SCROLL_THRESHOLD;

            if (stillAtBottom && !isChangingRef.current) {
              isChangingRef.current = true;
              const nextSlide = currentSlide + 1;
              setDirection("left");
              setCurrentSlide(nextSlide);
              setSelectedCase(activeCases[nextSlide].sys.id);
              setIsAtBottom(false);
              /*
                            // Reset scroll para la nueva tarjeta después de la transición
                            setTimeout(() => {
                              const newRef = contentRefs.current[nextSlide];
                              if (newRef) newRef.scrollTop = 0;
                              isChangingRef.current = false;
                            }, 10);*/
            }
          }, AUTO_SCROLL_DELAY);
        }
      };

      const handleTouchStart = (e: TouchEvent) => {
        touchStartY.current = e.touches[0].clientY;
      };

      const handleTouchMove = (e: TouchEvent) => {
        touchEndY.current = e.touches[0].clientY;
        const currentRef = contentRefs.current[currentSlide];

        if (currentRef) {
          const { scrollTop, scrollHeight, clientHeight } = currentRef;
          const isBottom = scrollHeight - (scrollTop + clientHeight) <= SCROLL_THRESHOLD;
          const isSwipingDown = touchEndY.current < touchStartY.current;

          if (isBottom && isSwipingDown && !isLastSlide) {
            // Si el usuario hace scroll hacia abajo en el fondo, cambiar inmediatamente
            clearTimeout(autoScrollTimeout.current);
            if (!isChangingRef.current) {
              isChangingRef.current = true;
              const nextSlide = currentSlide + 1;
              setDirection("left");
              setCurrentSlide(nextSlide);
              setSelectedCase(activeCases[nextSlide].sys.id);
              setIsAtBottom(false);

              setTimeout(() => {
                const newRef = contentRefs.current[nextSlide];
                if (newRef) newRef.scrollTop = 0;
                isChangingRef.current = false;
              }, 10);
            }
          }
        }
      };

      checkScrollable();
      currentRef.addEventListener('scroll', handleScroll);
      currentRef.addEventListener('touchstart', handleTouchStart, { passive: true });
      currentRef.addEventListener('touchmove', handleTouchMove, { passive: true });

      return () => {
        clearTimeout(autoScrollTimeout.current);
        currentRef.removeEventListener('scroll', handleScroll);
        currentRef.removeEventListener('touchstart', handleTouchStart);
        currentRef.removeEventListener('touchmove', handleTouchMove);
        isChangingRef.current = false;
      };
    }
  }, [currentSlide, isLastSlide, activeCases, isMobile]);

  const handleSlideChange = (index: number) => {
    clearTimeout(autoScrollTimeout.current);
    isChangingRef.current = true;

    setDirection(index > currentSlide ? "left" : "right");
    setCurrentSlide(index);
    setSelectedCase(activeCases[index].sys.id);
    setIsAtBottom(false);

    /*// Reset scroll para la nueva tarjeta después de la transición
    setTimeout(() => {
      const newRef = contentRefs.current[index];
      if (newRef) newRef.scrollTop = 0;
      isChangingRef.current = false;
    }, 10);*/
  };

  const navigateSlide = (direction: SlideDirection) => {
    if (direction === "left" && currentSlide < activeCases.length - 1) {
      handleSlideChange(currentSlide + 1);
    } else if (direction === "right" && currentSlide > 0) {
      handleSlideChange(currentSlide - 1);
    }
  };

  const slideVariants = {
    enter: (direction: SlideDirection) => ({
      x: direction === "left" ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: SlideDirection) => ({
      zIndex: 0,
      x: direction === "left" ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  const computedImageWidth = (width: string | undefined) => {
    if (!width) return "100%";
    if (width === "full") return "100%";
    if (width === "half") return "50%";
    if (width === "third") return "33%";
    if (width === "quarter") return "25%";
    return width;
  };

  const getLayoutClasses = (position: ImagePosition) => {
    switch (position) {
      case "right":
        return "flex-col md:flex-row";
      case "left":
        return "flex-col md:flex-row-reverse";
      case "top":
        return "flex-col";
      case "bottom":
        return "flex-col-reverse";
      default:
        return "";
    }
  };

  const CaseContent = ({ caseData, index }: { caseData: any; index: number }) => (
    <div className="relative">
      <motion.div
        className={`card-gradient rounded-lg p-6 relative overflow-hidden ${caseData.imagePosition === "background" ? "min-h-[400px]" : ""
          }`}
        style={{
          height: isMobile ? MOBILE_CARD_HEIGHT : "auto",
          ...(caseData.image?.fields?.file?.url &&
            caseData.imagePosition === "background"
            ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https:${caseData.image.fields.file.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
            : {}),
        }}
      >
        <h3 className="text-2xl font-bold mb-6 relative z-10">{caseData.name}</h3>

        {caseData.image?.fields?.file?.url ? (
          caseData.imagePosition === "background" ? (
            <div
              ref={(el) => (contentRefs.current[index] = el)}
              className={`prose prose-invert max-w-none relative z-10 ${isMobile ? 'overflow-y-auto h-[calc(100%-3rem)]' : 'overflow-visible'}`}
            >
              <div className="text-foreground/80">
                {documentToReactComponents(caseData.description)}
              </div>
              {isMobile && showScrollIndicator && index === currentSlide && (
                <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black/70 to-transparent pointer-events-none flex items-center justify-center">
                  <span className="text-white/80 text-sm animate-bounce">
                    {isAtBottom ? "Cambiando al siguiente..." : "Desplázate para leer más"}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div
              className={`flex ${getLayoutClasses(
                caseData.imagePosition as ImagePosition
              )} gap-6`}
              style={{ height: isMobile ? 'calc(100% - 3rem)' : 'auto' }}
            >
              <img
                src={`https:${caseData.image.fields.file.url}`}
                alt={caseData.image.fields.title || "Case Image"}
                className="rounded-lg shadow-lg transition-shadow duration-300 hover:shadow-xl"
                style={{
                  width: computedImageWidth(caseData.imageWidth),
                }}
              />
              <div
                ref={(el) => (contentRefs.current[index] = el)}
                className={`prose prose-invert max-w-none flex-1 ${isMobile ? 'overflow-y-auto' : 'overflow-visible'}`}
              >
                <div className="text-foreground/80">
                  {documentToReactComponents(caseData.description)}
                </div>
                {isMobile && showScrollIndicator && index === currentSlide && (
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent pointer-events-none flex items-center justify-center">
                    <span className="text-white/80 text-sm animate-bounce">
                      {isAtBottom ? "Cambiando al siguiente..." : "Desplázate para leer más"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )
        ) : (
          <div
            ref={(el) => (contentRefs.current[index] = el)}
            className={`prose prose-invert max-w-none ${isMobile ? 'overflow-y-auto h-[calc(100%-3rem)]' : 'overflow-visible'}`}
          >
            <div className="text-foreground/80">
              {documentToReactComponents(caseData.description)}
            </div>
            {isMobile && showScrollIndicator && index === currentSlide && (
              <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/70 to-transparent pointer-events-none flex items-center justify-center">
                <span className="text-white/80 text-sm animate-bounce">
                  {isAtBottom ? "Cambiando al siguiente..." : "Desplázate para leer más"}
                </span>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );

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

          <div className="md:col-span-8 relative">
            <AnimatePresence mode="wait" custom={direction}>
              {selectedCaseData && (
                <motion.div
                  key={selectedCase}
                  custom={direction}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={slideVariants}
                  transition={{ duration: 0.3 }}
                >
                  <CaseContent
                    caseData={selectedCaseData}
                    index={activeCases.findIndex(c => c.sys.id === selectedCase)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="relative" style={{ height: isMobile ? MOBILE_CARD_HEIGHT : 'auto' }}>
            <AnimatePresence mode="wait" custom={direction}>
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
                className="h-full"
              >
                <CaseContent
                  caseData={activeCases[currentSlide].fields}
                  index={currentSlide}
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation buttons */}
            {currentSlide > 0 && (
              <button
                onClick={() => navigateSlide("right")}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 rounded-full shadow-lg z-10"
                aria-label="Anterior caso"
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {currentSlide < activeCases.length - 1 && (
              <button
                onClick={() => navigateSlide("left")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-background/80 rounded-full shadow-lg z-10"
                aria-label="Siguiente caso"
              >
                <ChevronRight size={24} />
              </button>
            )}
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-4 mt-6">
            {activeCases.map((_, index) => (
              <button
                key={index}
                onClick={() => handleSlideChange(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? "bg-primary w-6" : "bg-primary/30"
                  }`}
                aria-label={`Ir al caso ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}