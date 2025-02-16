import { Button } from "./ui/button";
import { CtaSection } from "@/types/contentful";
import Link from "next/link";
import { getTargetHref } from "@/lib/scroll-utils";
import { SectionLink } from "./ui/section-link";

interface CtaProps {
  content: CtaSection;
}

export function Cta({ content }: CtaProps) {
  const { title, subtitle, ctaText, ctaUrl, isVisible, sectionId, ctaSection } =
    content;

  if (!isVisible) return null;

  return (
    <section id={sectionId} className="py-24 relative">
      <div className="absolute inset-0 gradient-bg opacity-50" />
      <div className="container max-w-6xl mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 text-lg mb-8">{subtitle}</p>
          {ctaText && (ctaUrl || ctaSection) && (
            <SectionLink
              href={getTargetHref(ctaSection, ctaUrl)}
              ctaSection={ctaSection}
              ctaUrl={ctaUrl}
            >
              {ctaText}
            </SectionLink>
          )}
        </div>
      </div>
    </section>
  );
}
