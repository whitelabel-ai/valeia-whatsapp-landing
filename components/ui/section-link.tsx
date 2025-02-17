"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface SectionLinkProps {
  href: string;
  ctaSection?: string;
  ctaUrl?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  style?: React.CSSProperties;
  children: React.ReactNode;
  asLink?: boolean;
}

export function SectionLink({
  href,
  ctaSection,
  ctaUrl,
  className,
  variant = "default",
  style,
  children,
  asLink = false,
}: SectionLinkProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!ctaSection) return;

    e.preventDefault();
    const element = document.getElementById(ctaSection);
    if (!element) {
      if (ctaUrl) {
        window.location.href = ctaUrl;
      }
      return;
    }

    const offset = 80;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  };

  if (asLink) {
    return (
      <Link
        href={href}
        onClick={handleClick}
        className={cn(
          "inline-flex items-center text-primary font-medium hover:underline group-hover:translate-x-1 transition-transform",
          className
        )}
        style={style}
      >
        {children}
      </Link>
    );
  }

  return (
    <Button asChild variant={variant} className={className} style={style}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
