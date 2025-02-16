"use client";

import { ProductDemoSection } from "@/types/contentful";
import { Button } from "./ui/button";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultMarkdownComponents } from "./ui/markdown-components";
import { getTargetHref } from "@/lib/scroll-utils";
import { SectionLink } from "./ui/section-link";

interface ProductDemoProps {
  content: ProductDemoSection;
}

export function ProductDemo({ content }: ProductDemoProps) {
  const {
    title,
    subtitle,
    descriptionTitle,
    description,
    videoUrl,
    videoPosition,
    aspectRatio,
    videoHeight,
    ctaText,
    ctaUrl,
    sectionId,
    ctaSection,
    isVisible,
  } = content;

  if (!isVisible) return null;

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video";
      case "4:3":
        return "aspect-4/3";
      case "1:1":
        return "aspect-square";
      case "9:16":
        return "aspect-[9/16]";
      default:
        return "aspect-video";
    }
  };

  const embedVideo = () => {
    const videoId = videoUrl.includes("youtube.com/shorts")
      ? videoUrl.split("shorts/")[1]
      : videoUrl.includes("youtube.com/watch?v=")
        ? videoUrl.split("v=")[1]
        : videoUrl.includes("vimeo")
          ? videoUrl.split("/").pop()
          : null;

    const embedUrl = videoId
      ? videoUrl.includes("youtube")
        ? `https://www.youtube.com/embed/${videoId}`
        : `https://player.vimeo.com/video/${videoId}`
      : videoUrl;

    const maxMobileHeight = Math.min(videoHeight || 400);

    return (
      <div
        className={`relative ${getAspectRatioClass()} max-w-full`}
        style={{
          height: videoHeight
            ? `min(${videoHeight}px, ${maxMobileHeight}px)`
            : "auto",
          maxHeight: "70vh",
          maxWidth: "100%",
        }}
      >
        <iframe
          src={embedUrl}
          className="absolute inset-0 w-full h-full rounded-lg shadow-lg"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  const renderContent = () => {
    const textContent = (
      <div className="flex flex-col justify-center">
        {descriptionTitle && (
          <h3 className="text-xl md:text-2xl font-semibold mb-4">
            {descriptionTitle}
          </h3>
        )}
        {description && (
          <div className="prose prose-invert w-full max-w-none mb-8">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={defaultMarkdownComponents}
            >
              {description}
            </ReactMarkdown>
          </div>
        )}
        {ctaText && (ctaUrl || ctaSection) && (
          <div className="w-full flex justify-center md:justify-start">
            <SectionLink
              href={getTargetHref(ctaSection, ctaUrl)}
              ctaSection={ctaSection}
              ctaUrl={ctaUrl}
              className="btn btn-primary btn-lg w-full md:w-auto"
            >
              {ctaText}
            </SectionLink>
          </div>
        )}
      </div>
    );

    const videoContent = (
      <div className="w-full flex justify-center items-center  px-4 md:px-0">
        <div className="w-full max-w-4xl">{embedVideo()}</div>
      </div>
    );

    const textContentContainer = (
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 md:px-6">
        {textContent}
      </div>
    );

    switch (videoPosition) {
      case "left":
        return (
          <div className="flex flex-col md:flex-row gap-8 md:gap-24 justify-center items-center">
            <div className="">{videoContent}</div>
            {textContentContainer}
          </div>
        );
      case "right":
        return (
          <div className="flex flex-col md:flex-row gap-24 md:gap-24 justify-center items-center">
            {textContentContainer}
            <div className="">{videoContent}</div>
          </div>
        );
      case "bottom":
        return (
          <div className="flex flex-col gap-8 md:gap-12">
            <div className="text-center max-w-3xl mx-auto">{textContent}</div>
            {videoContent}
          </div>
        );
      case "top":
        return (
          <div className="flex flex-col gap-8 md:gap-12">
            {videoContent}
            <div className="text-center max-w-3xl mx-auto">{textContent}</div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id={sectionId} className="py-12 md:py-24 relative">
      <div className="container mx-auto px-4">
        <header className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold">
            {title}
          </h2>
          {subtitle && (
            <p className="text-base md:text-lg text-foreground/60 mt-2">
              {subtitle}
            </p>
          )}
        </header>
        {renderContent()}
      </div>
    </section>
  );
}
