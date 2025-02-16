"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { useState } from "react";
import { HeaderSection, DynamicPage } from "@/types/contentful";
import { getTargetHref, handleSectionScroll } from "@/lib/scroll-utils";

interface HeaderProps {
  content: HeaderSection;
  navigationPages: DynamicPage[];
  currentLandingSlug?: string;
}

export function Header({
  content,
  navigationPages,
  currentLandingSlug = "/",
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logo, ctaText, ctaUrl, ctaSection, widthLogo } = content;

  // Function to clean URLs by removing duplicated segments
  const cleanUrl = (url: string) => {
    if (!url || url === "/") return "/";

    const segments = url.split("/").filter((segment) => segment !== "");
    const uniqueSegments = segments.reduce((acc: string[], segment) => {
      if (!acc.includes(segment)) {
        acc.push(segment);
      }
      return acc;
    }, []);

    return "/" + uniqueSegments.join("/");
  };

  // Filter navigation pages based on parent landing page
  const headerPages = navigationPages.filter((page) => {
    if (page.location !== "header" || !page.isVisible) return false;

    // Show global pages (no parent) only on root landing
    if (!page.parentLandingSlug) {
      return currentLandingSlug === "/";
    }

    // Show landing-specific pages only on their parent landing
    return page.parentLandingSlug === currentLandingSlug;
  });

  const getPageUrl = (page: DynamicPage) => {
    if (!page.parentLandingSlug || page.parentLandingSlug === "/") {
      return `/${page.slug}`;
    }

    // Split the parent landing slug and the page slug into segments
    const parentSegments = page.parentLandingSlug
      .split("/")
      .filter((segment) => segment !== "");
    const pageSlug = page.slug;

    // Remove duplicated segments
    const uniqueSegments = parentSegments.reduce((acc: string[], segment) => {
      if (!acc.includes(segment) && segment !== pageSlug) {
        acc.push(segment);
      }
      return acc;
    }, []);

    // Combine unique segments with the page slug
    return "/" + [...uniqueSegments, pageSlug].join("/");
  };

  // Clean the currentLandingSlug for the logo link
  const cleanedLandingSlug = cleanUrl(currentLandingSlug);

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-sm border-b pb-3 pt-4">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href={cleanedLandingSlug} className="flex items-center space-x-2">
          {logo?.fields?.file?.url && (
            <img
              src={`https:${logo.fields.file.url}`}
              alt={logo.fields.title}
              width={
                typeof widthLogo === "number" && widthLogo > 0 ? widthLogo : 100
              }
            />
          )}
        </Link>

        <nav className="hidden md:flex items-center space-x-8">
          {headerPages.map((page) => (
            <Link
              key={page.slug}
              href={getPageUrl(page)}
              className="text-foreground/80 hover:text-foreground"
            >
              {page.label}
            </Link>
          ))}
          {/* Agregar el link al blog de forma permanente */}
          <Link
            href="/blog"
            className="text-foreground/80 hover:text-foreground"
          >
            Blog
          </Link>

          {ctaText && (ctaUrl || ctaSection) && (
            <Button asChild>
              <a
                href={getTargetHref(ctaSection, ctaUrl)}
                onClick={(e) => handleSectionScroll(e, ctaSection, ctaUrl)}
              >
                {ctaText}
              </a>
            </Button>
          )}
        </nav>

        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-16 w-full bg-background border-b">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {currentLandingSlug === "/" && (
              <Link
                href="/blog"
                className="text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
            )}
            {headerPages.map((page) => (
              <Link
                key={page.slug}
                href={getPageUrl(page)}
                className="text-foreground/80 hover:text-foreground"
                onClick={() => setIsMenuOpen(false)}
              >
                {page.label}
              </Link>
            ))}
            {ctaUrl ||
              (ctaSection && (
                <Button asChild className="w-full">
                  <a
                    href={getTargetHref(ctaSection, ctaUrl)}
                    onClick={(e) => handleSectionScroll(e, ctaSection, ctaUrl)}
                  >
                    {ctaText}
                  </a>
                </Button>
              ))}
          </nav>
        </div>
      )}
    </header>
  );
}
