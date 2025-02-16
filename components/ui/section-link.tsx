"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

interface SectionLinkProps {
  href: string;
  ctaSection?: string;
  ctaUrl?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export function SectionLink({
  href,
  ctaSection,
  ctaUrl,
  className,
  variant = "default",
  style,
  children,
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

  return (
    <Button asChild variant={variant} className={className} style={style}>
      <Link href={href} onClick={handleClick}>
        {children}
      </Link>
    </Button>
  );
}
