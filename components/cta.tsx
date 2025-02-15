import { Button } from "./ui/button";
import { CtaSection } from "@/types/contentful";
import Link from "next/link";
import { getTargetHref, handleSectionScroll } from "@/lib/scroll-utils";

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
      </div>
    </section>
  );
}
