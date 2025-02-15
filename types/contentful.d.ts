// Tipos base para los campos de sistema de Contentful
interface ContentfulSys {
  space: {
    sys: {
      type: "Link";
      linkType: "Space";
      id: string;
    };
  };
  id: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  environment: {
    sys: {
      id: string;
      type: "Link";
      linkType: "Environment";
    };
  };
  publishedVersion: number;
  revision: number;
  contentType: {
    sys: {
      type: "Link";
      linkType: "ContentType";
      id: string;
    };
  };
  locale: string;
}

interface ContentfulAsset {
  metadata: {
    tags: any[];
    concepts: any[];
  };
  sys: ContentfulSys;
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      details: {
        size: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

interface ContentfulEntry<T> {
  metadata: {
    tags: any[];
    concepts: any[];
  };
  sys: ContentfulSys;
  fields: T;
}

// Tipos para cada modelo de contenido
export type Theme =
  | "defaultLight"
  | "defaultDark"
  | "cosmicLight"
  | "cosmicDark"
  | "midnightLight"
  | "midnightDark"
  | "sunsetLight"
  | "sunsetDark"
  | "forestLight"
  | "forestDark"
  | "oceanLight"
  | "oceanDark"
  | "auroraLight"
  | "aurora"
  | "sepia"
  | "moonlight";

export interface CustomTheme {
  name: string;
  primaryColor: string;
  accentColor?: string;
  backgroundColor: string;
  textColor: string;
  style: "minimal" | "gradient" | "glass";
  borderRadius?: number;
  preview?: ContentfulAsset;
}

// Update the LandingPage interface to include dynamicPages
export interface LandingPage {
  internalName: string;
  favicon?: ContentfulAsset;
  slug: string;
  title: string;
  description: string;
  theme: Theme;
  customTheme?: ContentfulEntry<CustomTheme>;
  googleTagManager?: string;
  valeiaChat?: boolean;
  sections: Array<ContentfulEntry<any>>;
  dynamicPages?: Array<ContentfulEntry<DynamicPage>>;
  isVisible: boolean;
  sys: ContentfulSys;
}

// Update the DynamicPage interface
export interface DynamicPage {
  title: string;
  seoDescription?: string;
  slug: string;
  content: any;
  featuredImage?: ContentfulAsset;
  isVisible: boolean;
  label?: string;
  location: "header" | "footer" | "blog" | "legal" | null;
  author?: string;
  publishDate?: string;
  tags?: string[];
  parentLandingSlug?: string;
  sys?: ContentfulSys;
}

export interface HeaderSection {
  logo: ContentfulAsset;
  widthLogo?: number;
  ctaText?: string;
  ctaUrl?: string;
  ctaSection?: string;
}

export interface HeroSection {
  title: string;
  highlightedText: string;
  description: string;
  ctaText: string;
  ctaUrl?: string;
  isVisible: boolean;
  image?: ContentfulAsset;
  imagePosition?: "right" | "left" | "top" | "bottom" | "background";
  imageWidth?: number;
  ctaSection?: string;
  sectionId: string;
}

export interface PartnersSection {
  title: string;
  subtitle?: string;
  logos: ContentfulAsset[];
  displayMode: "grid" | "scroll";
  scrollSpeed?: number;
  height?: number;
  backgroundColor?: string;
  isVisible: boolean;
  ctaSection: string;
  sectionId: string;
}

export interface ProcessStep {
  title: string;
  description: string;
  icon: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSection?: string;
}

export interface ProcessSection {
  title: string;
  subtitle: string;
  steps: ContentfulEntry<ProcessStep>[];
  isVisible: boolean;
  ctaSection: string;
  sectionId: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  description?: string;
  features?: string[];
  highlightedText?: boolean;
  promotionalText?: string;
  payLinkText?: string;
  payLink?: string;
}

export interface PricingSection {
  title: string;
  subtitle: string;
  plans: ContentfulEntry<PricingPlan>[];
  isVisible: boolean;
  ctaSection: string;
  sectionId: string;
}

export interface Benefit {
  title: string;
  tabLabel: string;
  description: any;
  features?: string[];
  image?: ContentfulAsset;
  imagePosition?: "right" | "left";
  imageHeight?: number;
  imageAspectRatio?: "16:9" | "4:3" | "1:1" | "9:16" | "auto";
  imageFit?: "Ajustar" | "Rellenar" | "Expandir";
  ctaText?: string;
  ctaUrl?: string;
  ctaSection?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  secondaryCtaSection?: string;
}

export interface BenefitsSection {
  title: string;
  subtitle?: string;
  benefits?: ContentfulEntry<Benefit>[];
  isVisible: boolean;
  backgroundColor?: string;
  accentColor?: string;
  sectionId: string;
}

export interface ProductDemoSection {
  title: string;
  subtitle?: string;
  descriptionTitle?: string;
  description?: any;
  videoUrl: string;
  videoPosition: "right" | "left" | "bottom" | "top";
  aspectRatio: "16:9" | "4:3" | "1:1" | "9:16";
  videoHeight?: number;
  ctaText?: string;
  ctaUrl?: string;
  ctaSection?: string;
  isVisible: boolean;
  ctaSection: string;
  sectionId: string;
}

export interface UseCase {
  name: string;
  description: Any;
  icon?: ContentfulAsset;
  image?: ContentfulAsset;
  accentColor?: string;
  imagePosition?: "right" | "left" | "top" | "bottom" | "background";
  imageWidth?: number;
  isActive?: boolean;
}

export interface UseCasesSection {
  title: string;
  subtitle?: string;
  cases: ContentfulEntry<UseCase>[];
  isVisible: boolean;
  sectionId: string;
}

export interface LeadMagnet {
  title: string;
  description: any; // Rich text
  image: ContentfulAsset;
  imagePosition?: "right" | "left";
  imageFit?: "Ajustar" | "Rellenar" | "Expandir";
  features?: string[];
  ctaText: string;
}

export interface LeadMagnetSection {
  title: string;
  subtitle: string;
  leadMagnets: ContentfulEntry<LeadMagnet>[];
  titleModal: string;
  subtitleModal: string;
  ctaTextModal: string;
  fieldsToCapture: string[];
  submitEndpoint: string;
  confirmationTitle: string;
  confirmationMessage: string;
  backgroundColor?: string;
  isVisible: boolean;
  sectionId: string;
}

export interface FAQ {
  question?: string;
  answer?: string;
}

export interface FaqSection {
  title: string;
  subtitle: string;
  faqs?: ContentfulEntry<FAQ>[];
  columns?: number;
  isVisible: boolean;
  sectionId: string;
}

export interface CtaSection {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaUrl?: string;
  isVisible: boolean;
  ctaSection?: string;
  sectionId: string;
}

export interface SocialLink {
  redSocial:
    | "Facebook"
    | "Twitter"
    | "Instagram"
    | "LinkedIn"
    | "YouTube"
    | "WhatsApp"
    | "TikTok";
  url: string;
}

export interface FooterSection {
  logo: ContentfulAsset;
  widthLogo: number;
  socialLinks: ContentfulEntry<SocialLink>[];
  colorSocialLinks: boolean;
  email: string;
  phone: string;
  copyright: string;
  isVisible: boolean;
  ctaSection: string;
  sectionId: string;
}

interface RichTextContent {
  data: Record<string, any>;
  content: Array<{
    data: Record<string, any>;
    content: Array<{
      data: Record<string, any>;
      marks: Array<{
        type: string;
      }>;
      value: string;
      nodeType: string;
    }>;
    nodeType: string;
  }>;
  nodeType: string;
}
