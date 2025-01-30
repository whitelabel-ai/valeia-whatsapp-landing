"use client";

import Image from "next/image";
import Link from "next/link";
import { FooterSection, DynamicPage } from "@/types/contentful";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  MessageCircle,
  Music2,
} from "lucide-react";

interface FooterProps {
  content: FooterSection;
  navigationPages: DynamicPage[];
}

const SOCIAL_ICONS = {
  Facebook: Facebook,
  Twitter: Twitter,
  Instagram: Instagram,
  LinkedIn: Linkedin,
  YouTube: Youtube,
  WhatsApp: MessageCircle,
  TikTok: Music2,
};

export function Footer({ content, navigationPages }: FooterProps) {
  const { logo, widthLogo, socialLinks, email, phone, copyright, isVisible } =
    content;

  if (!isVisible) return null;

  const footerPages = navigationPages.filter(
    (page) => page.location === "footer" && page.isVisible && page.slug
  );

  const validLegalPages = navigationPages.filter(
    (page) => page.location === "legal" && page.isVisible && page.slug
  );

  return (
    <footer className="card-gradient py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            {logo?.fields?.file?.url && (
              <Link href="/" className="inline-block mb-6">
                <img
                  src={`https:${logo.fields.file.url}`}
                  alt={logo.fields.title}
                  width={
                    typeof widthLogo === "number" && widthLogo > 0
                      ? widthLogo
                      : 100
                  }
                />
              </Link>
            )}
            <div className="flex space-x-4">
              {socialLinks?.map((link) => {
                const Icon =
                  SOCIAL_ICONS[
                    link.fields.redSocial as keyof typeof SOCIAL_ICONS
                  ];
                return link.fields?.url ? (
                  <a
                    key={link.fields.redSocial}
                    href={link.fields.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/60 hover:text-primary transition-colors"
                    title={link.fields.redSocial}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ) : null;
              })}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Menú</h3>
            <ul className="space-y-2">
              {footerPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2">
              {email && (
                <li>
                  <a
                    href={`mailto:${email}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {email}
                  </a>
                </li>
              )}
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {phone}
                  </a>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {validLegalPages.map((page) => (
                <li key={page.slug}>
                  <Link
                    href={`/${page.slug}`}
                    className="text-foreground/60 hover:text-foreground transition-colors"
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-center text-foreground/60">
            {/*copyright*/}
            2025 desarrollado con Go lean por Whitelabel, derechos reservados ©
            Diseñado con pasión para impulsar tu crecimiento.
          </p>
        </div>
      </div>
    </footer>
  );
}
