import { HeroSection } from "@/types/contentful";
import { getTargetHref } from "@/lib/scroll-utils";
import { SectionLink } from "./ui/section-link";
import { processGradient, processTextStyle } from "@/lib/color-utils";

interface HeroProps {
  content: HeroSection;
}

export function Hero({ content }: HeroProps) {
  const {
    sectionId,
    title,
    highlightedText,
    description,
    ctaText,
    ctaUrl,
    ctaSection,
    secondaryCtaText,
    secondaryCtaUrl,
    secondaryCtaSection,
    isVisible,
    image,
    imagePosition = "right",
    imageWidth,
    imageMobile,
    gradientOverlay,
    titleColor,
    highlightedTextColor,
    descriptionColor,
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

  const gradientStyle = processGradient(gradientOverlay);

  const isVideo = image?.fields?.file?.contentType?.includes("video");
  const mediaUrl = image?.fields?.file?.url
    ? `https:${image.fields.file.url}`
    : null;

  const isMobileVideo = imageMobile?.fields?.file?.contentType?.includes("video");
  const mobileMediaUrl = imageMobile?.fields?.file?.url
    ? `https:${imageMobile.fields.file.url}`
    : null;

  // Estilos de texto con detección automática de gradientes
  const titleStyle = processTextStyle(
    titleColor,
    "text-3xl md:text-4xl lg:text-6xl font-bold mt-8 md:mt-20 mb-6"
  );

  const highlightedTextStyle = processTextStyle(
    highlightedTextColor,
    "text-gradient" // Clase por defecto si no hay color personalizado
  );

  const descriptionStyle = processTextStyle(
    descriptionColor,
    "text-base md:text-lg lg:text-2xl text-foreground/80 mb-8 max-w-2xl mx-auto"
  );

  return (
    <section
      id={sectionId}
      className={`relative ${image && imagePosition === "background"
        ? "pt-40 pb-24 overflow-hidden"
        : "py-20"
        }`}
    >
      {/* Fondo de video o imagen */}
      {mediaUrl && imagePosition === "background" && (
        <div className="absolute inset-0 z-0">
          {isVideo ? (
            <>
              {/* Video para desktop */}
              <video
                src={mediaUrl}
                autoPlay
                muted
                loop
                className="hidden md:block w-full h-full object-cover"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />

              {/* Video para mobile */}
              {mobileMediaUrl ? (
                isMobileVideo ? (
                  <video
                    src={mobileMediaUrl}
                    autoPlay
                    muted
                    loop
                    className="block md:hidden w-full h-full object-cover"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="block md:hidden w-full h-full"
                    style={{
                      backgroundImage: `url(${mobileMediaUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )
              ) : (
                <video
                  src={mediaUrl}
                  autoPlay
                  muted
                  loop
                  className="block md:hidden w-full h-full object-cover"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}

              {/* Capa de gradiente */}
              <div
                className="absolute inset-0"
                style={{ background: gradientStyle }}
              />
            </>
          ) : (
            <>
              {/* Imagen para desktop */}
              <div
                className="hidden md:block w-full h-full"
                style={{
                  backgroundImage: `${gradientStyle}, url(${mediaUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                }}
              />

              {/* Contenido para mobile */}
              {mobileMediaUrl ? (
                isMobileVideo ? (
                  <video
                    src={mobileMediaUrl}
                    autoPlay
                    muted
                    loop
                    className="block md:hidden w-full h-full object-cover"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    className="block md:hidden w-full h-full"
                    style={{
                      backgroundImage: `url(${mobileMediaUrl})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                    }}
                  />
                )
              ) : (
                <div
                  className="block md:hidden w-full h-full"
                  style={{
                    backgroundImage: `url(${mediaUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              )}

              {/* Capa de gradiente */}
              <div
                className="absolute inset-0"
                style={{ background: gradientStyle }}
              />
            </>
          )}
          <div className="absolute inset-0 gradient-bg" />
        </div>
      )}

      <div className="container mx-auto max-w-6xl px-4 relative z-10">
        {mediaUrl && imagePosition !== "background" ? (
          <div
            className={`w-full flex flex-col ${layoutClasses} items-center gap-8`}
          >
            {imagePosition === "top" || imagePosition === "bottom" ? (
              <>
                {isVideo ? (
                  <>
                    <video
                      src={mediaUrl}
                      autoPlay
                      muted
                      loop
                      className="hidden md:block mx-auto rounded-lg w-full md:w-auto"
                      style={{ maxWidth: computedImageWidth }}
                    />
                    {mobileMediaUrl ? (
                      isMobileVideo ? (
                        <video
                          src={mobileMediaUrl}
                          autoPlay
                          muted
                          loop
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      ) : (
                        <img
                          src={mobileMediaUrl}
                          alt={imageMobile?.fields?.title || "Hero Mobile Image"}
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      )
                    ) : (
                      <video
                        src={mediaUrl}
                        autoPlay
                        muted
                        loop
                        className="md:hidden mx-auto rounded-lg w-full"
                      />
                    )}
                  </>
                ) : (
                  <>
                    <img
                      src={mediaUrl}
                      alt={image?.fields?.title || "Hero Image"}
                      className="hidden md:block mx-auto rounded-lg w-full md:w-auto"
                      style={{ maxWidth: computedImageWidth }}
                    />
                    {mobileMediaUrl ? (
                      isMobileVideo ? (
                        <video
                          src={mobileMediaUrl}
                          autoPlay
                          muted
                          loop
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      ) : (
                        <img
                          src={mobileMediaUrl}
                          alt={imageMobile?.fields?.title || "Hero Mobile Image"}
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      )
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={image?.fields?.title || "Hero Image"}
                        className="md:hidden mx-auto rounded-lg w-full"
                      />
                    )}
                  </>
                )}
                <div className="text-center w-full">
                  <h1 {...titleStyle}>
                    {title}{" "}
                    <span {...highlightedTextStyle}>{highlightedText}</span>
                  </h1>
                  <p {...descriptionStyle}>
                    {description}
                  </p>
                  <div className="flex flex-col md:flex-row gap-4 justify-center">
                    {ctaText && (ctaUrl || ctaSection) && (
                      <SectionLink
                        href={getTargetHref(ctaSection, ctaUrl)}
                        ctaSection={ctaSection}
                        ctaUrl={ctaUrl}
                        className="w-full md:w-auto"
                      >
                        {ctaText}
                      </SectionLink>
                    )}
                    {secondaryCtaText && (secondaryCtaUrl || secondaryCtaSection) && (
                      <SectionLink
                        href={getTargetHref(secondaryCtaSection, secondaryCtaUrl)}
                        ctaSection={secondaryCtaSection}
                        ctaUrl={secondaryCtaUrl}
                        variant="outline"
                        className="w-full md:w-auto"
                      >
                        {secondaryCtaText}
                      </SectionLink>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-full md:w-1/2 order-2 md:order-none">
                  {isVideo ? (
                    <>
                      <video
                        src={mediaUrl}
                        autoPlay
                        muted
                        loop
                        className="hidden md:block mx-auto rounded-lg w-full"
                        style={{ maxWidth: computedImageWidth }}
                      />
                      {mobileMediaUrl ? (
                        isMobileVideo ? (
                          <video
                            src={mobileMediaUrl}
                            autoPlay
                            muted
                            loop
                            className="md:hidden mx-auto rounded-lg w-full"
                          />
                        ) : (
                          <img
                            src={mobileMediaUrl}
                            alt={imageMobile?.fields?.title || "Hero Mobile Image"}
                            className="md:hidden mx-auto rounded-lg w-full"
                          />
                        )
                      ) : (
                        <video
                          src={mediaUrl}
                          autoPlay
                          muted
                          loop
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <img
                        src={mediaUrl}
                        alt={image?.fields?.title || "Hero Image"}
                        className="hidden md:block mx-auto rounded-lg w-full"
                        style={{ maxWidth: computedImageWidth }}
                      />
                      {mobileMediaUrl ? (
                        isMobileVideo ? (
                          <video
                            src={mobileMediaUrl}
                            autoPlay
                            muted
                            loop
                            className="md:hidden mx-auto rounded-lg w-full"
                          />
                        ) : (
                          <img
                            src={mobileMediaUrl}
                            alt={imageMobile?.fields?.title || "Hero Mobile Image"}
                            className="md:hidden mx-auto rounded-lg w-full"
                          />
                        )
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={image?.fields?.title || "Hero Image"}
                          className="md:hidden mx-auto rounded-lg w-full"
                        />
                      )}
                    </>
                  )}
                </div>
                <div className="text-start w-full md:w-1/2 order-1 md:order-none">
                  <h1 {...titleStyle}>
                    {title}{" "}
                    <span {...highlightedTextStyle}>{highlightedText}</span>
                  </h1>
                  <p {...descriptionStyle}>
                    {description}
                  </p>
                  <div className="flex flex-col md:flex-row gap-4">
                    {ctaText && (ctaUrl || ctaSection) && (
                      <SectionLink
                        href={getTargetHref(ctaSection, ctaUrl)}
                        ctaSection={ctaSection}
                        ctaUrl={ctaUrl}
                        className="w-full md:w-auto"
                      >
                        {ctaText}
                      </SectionLink>
                    )}
                    {secondaryCtaText && (secondaryCtaUrl || secondaryCtaSection) && (
                      <SectionLink
                        href={getTargetHref(secondaryCtaSection, secondaryCtaUrl)}
                        ctaSection={secondaryCtaSection}
                        ctaUrl={secondaryCtaUrl}
                        variant="outline"
                        className="w-full md:w-auto"
                      >
                        {secondaryCtaText}
                      </SectionLink>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto text-center">
            <h1 {...titleStyle}>
              {title} <span {...highlightedTextStyle}>{highlightedText}</span>
            </h1>
            <p {...descriptionStyle}>
              {description}
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              {ctaText && (ctaUrl || ctaSection) && (
                <SectionLink
                  href={getTargetHref(ctaSection, ctaUrl)}
                  ctaSection={ctaSection}
                  ctaUrl={ctaUrl}
                  variant="default"
                  className="w-full md:w-auto"
                >
                  {ctaText}
                </SectionLink>
              )}
              {secondaryCtaText && (secondaryCtaUrl || secondaryCtaSection) && (
                <SectionLink
                  href={getTargetHref(secondaryCtaSection, secondaryCtaUrl)}
                  ctaSection={secondaryCtaSection}
                  ctaUrl={secondaryCtaUrl}
                  variant="outline"
                  className="w-full md:w-auto"
                >
                  {secondaryCtaText}
                </SectionLink>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}