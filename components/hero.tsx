import { Button } from "./ui/button";
import { HeroSection } from "@/types/contentful";
import Link from "next/link";
import { getTargetHref, handleSectionScroll } from "@/lib/scroll-utils";

interface HeroProps {
  content: HeroSection;
}

export function Hero({ content }: HeroProps) {
  const {
    title,
    highlightedText,
    description,
    ctaText,
    ctaUrl,
    isVisible,
    image,
    imagePosition = "right",
    imageWidth,
    ctaSection,
    sectionId,
  } = content;

  if (!isVisible) return null;

  const computedImageWidth =
    typeof imageWidth === "number" && imageWidth > 0 ? imageWidth : 400;

  const imagePositionClasses = {
    right: "md:flex-row-reverse",
    left: "md:flex-row",
    top: "flex-col",
    bottom: "flex-col-reverse",
  };

  const layoutClasses =
    image && imagePosition !== "background"
      ? imagePositionClasses[
          imagePosition as keyof typeof imagePositionClasses
        ] || "md:flex-row"
      : "";

  return (
    <section
      id={sectionId}
      className={`relative ${
        image && imagePosition === "background"
          ? "pt-40 pb-24 overflow-hidden"
          : "py-20"
      }`}
      style={
        image?.fields?.file?.url && imagePosition === "background"
          ? {
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(https:${image.fields.file.url})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : {}
      }
    >
      {imagePosition === "background" && (
        <div className="absolute inset-0 gradient-bg" />
      )}

      <div className="container mx-auto max-w-6xl px-4 relative">
        {image?.fields?.file?.url && imagePosition !== "background" ? (
          <div
            className={`w-full flex flex-col ${layoutClasses} items-center gap-8`}
          >
            {imagePosition === "top" || imagePosition === "bottom" ? (
              <>
                <img
                  src={`https:${image.fields.file.url}`}
                  alt={image.fields.title || "Hero Image"}
                  className="mx-auto rounded-lg w-full md:w-auto"
                  style={{ maxWidth: computedImageWidth }}
                />
                <div className="text-center w-full">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
                    {title}{" "}
                    <span className="text-gradient">{highlightedText}</span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                    {description}
                  </p>
                  {ctaText && (ctaUrl || ctaSection) && (
                    <Button asChild size="lg" className="w-full md:w-auto">
                      <Link
                        href={getTargetHref(ctaSection, ctaUrl)}
                        onClick={(e) =>
                          handleSectionScroll(e, ctaSection, ctaUrl)
                        }
                      >
                        {ctaText}
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2 order-2 md:order-none">
                  <img
                    src={`https:${image.fields.file.url}`}
                    alt={image.fields.title || "Hero Image"}
                    className="mx-auto rounded-lg w-full"
                    style={{ maxWidth: computedImageWidth }}
                  />
                </div>
                <div className="text-start w-full md:w-1/2 order-1 md:order-none">
                  <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
                    {title}{" "}
                    <span className="text-gradient">{highlightedText}</span>
                  </h1>
                  <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
                    {description}
                  </p>
                  {ctaUrl && ctaText && (
                    <Button asChild size="lg">
                      <Link
                        href={getTargetHref(ctaSection, ctaUrl)}
                        onClick={(e) =>
                          handleSectionScroll(e, ctaSection, ctaUrl)
                        }
                      >
                        {ctaText}
                      </Link>
                    </Button>
                  )}
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6">
              {title} <span className="text-gradient">{highlightedText}</span>
            </h1>
            <p className="text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto">
              {description}
            </p>
            {(ctaUrl && ctaText) ||
              (ctaSection && (
                <Button asChild size="lg">
                  <Link
                    href={getTargetHref(ctaSection, ctaUrl)}
                    onClick={(e) => handleSectionScroll(e, ctaSection, ctaUrl)}
                  >
                    {ctaText}
                  </Link>
                </Button>
              ))}
          </div>
        )}
      </div>
    </section>
  );
}
