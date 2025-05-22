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
import { processBackgroundStyle } from "@/lib/color-utils";

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

const SOCIAL_COLORS = {
  Facebook: "#1877F2",
  Twitter: "#1DA1F2",
  Instagram: "#E1306C",
  LinkedIn: "#0077B5",
  YouTube: "#FF0000",
  WhatsApp: "#25D366",
  TikTok: "#000000",
};

export function Footer({ content, navigationPages }: FooterProps) {
  const {
    logo,
    widthLogo,
    socialLinks,
    colorSocialLinks,
    email,
    phone,
    backgroundColor,
    copyright,
    isVisible,
  } = content;

  if (!isVisible) return null;

  // Procesar el estilo de fondo
  const footerStyle = processBackgroundStyle(
    backgroundColor,
    "card-gradient py-12"
  );

  const footerPages = navigationPages.filter(
    (page) => page.location === "footer" && page.isVisible && page.slug
  );

  const validLegalPages = navigationPages.filter(
    (page) => page.location === "legal" && page.isVisible && page.slug
  );

  const footerItems = [
    logo?.fields?.file?.url && "logo",
    footerPages.length > 0 && "menu",
    (email || phone) && "contacto",
    validLegalPages.length > 0 && "legal",
  ].filter(Boolean);

  return (
    <footer
      className={footerStyle.className}
      style={footerStyle.style}
    >
      <div className="container max-w-6xl mx-auto px-4">
        <div
          className="grid gap-8 mb-8 text-center md:text-left"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(footerItems.length, 4)}, minmax(0, 1fr))`,
            justifyContent: "space-between",
          }}
        >
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
                  className="mx-auto md:mx-0"
                />
              </Link>
            )}
            <div className="flex justify-center md:justify-start space-x-4">
              {socialLinks?.map((link) => {
                const Icon =
                  SOCIAL_ICONS[
                  link.fields.redSocial as keyof typeof SOCIAL_ICONS
                  ];
                const color =
                  SOCIAL_COLORS[
                  link.fields.redSocial as keyof typeof SOCIAL_COLORS
                  ];
                return link.fields?.url ? (
                  <a
                    key={link.fields.redSocial}
                    href={link.fields.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative"
                    title={link.fields.redSocial}
                  >
                    <div className="p-2 rounded-full transition-all duration-300 hover:bg-foreground/10 ">
                      <Icon
                        className={`h-6 w-6 transition-all duration-300 group-hover:scale-110 ${colorSocialLinks
                          ? ""
                          : "text-foreground/60 group-hover:text-foreground"
                          }`}
                        style={colorSocialLinks ? { color } : {}}
                      />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-foreground/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                      {link.fields.redSocial}
                    </span>
                  </a>
                ) : null;
              })}
            </div>
          </div>

          {footerPages.length > 0 && (
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
          )}
          {(email || phone) && (
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
          )}

          {validLegalPages.length > 0 && (
            <div className="justify-self-end">
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
          )}
        </div>

        <div className="border-t border-border pt-8">
          <p className="text-center text-foreground/60">
            {/*copyright || */(
              <>
                2025 desarrollado con{" "}
                <a
                  href="https://golean.lat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Go lean
                </a>{" "}
                por Whitelabel, derechos reservados ©
                <br className="md:hidden" />
                Diseñado con pasión para impulsar tu crecimiento.
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}