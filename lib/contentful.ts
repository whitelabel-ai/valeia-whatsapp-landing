import { createClient } from "contentful";
import { DynamicPage, LandingPage } from "@/types/contentful";

let client: ReturnType<typeof createClient> | null = null;

// Validar credenciales de Contentful
function validateContentfulCredentials() {
  if (
    !process.env.CONTENTFUL_SPACE_ID ||
    !process.env.CONTENTFUL_ACCESS_TOKEN
  ) {
    return {
      isValid: false,
      error:
        "Credenciales de Contentful no encontradas. Asegúrese de configurar CONTENTFUL_SPACE_ID y CONTENTFUL_ACCESS_TOKEN en las variables de entorno.",
    };
  }
  return { isValid: true };
}

// Crear cliente de Contentful con validación
function createContentfulClient() {
  const validation = validateContentfulCredentials();
  if (!validation.isValid) {
    return { client: null, error: validation.error };
  }

  try {
    const client = createClient({
      space: process.env.CONTENTFUL_SPACE_ID!,
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
    });
    return { client, error: null };
  } catch (error) {
    return {
      client: null,
      error: "Error al inicializar el cliente de Contentful",
    };
  }
}

const clientSetup = createContentfulClient();
if (clientSetup.client) {
  client = clientSetup.client;
}

export async function checkContentfulConnection(): Promise<{
  isConnected: boolean;
  error?: string;
}> {
  if (!client) {
    return {
      isConnected: false,
      error: clientSetup.error || "Error de configuración de Contentful",
    };
  }

  try {
    await client.getSpace();
    return { isConnected: true };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error de conexión con Contentful:", errorMessage);
    return {
      isConnected: false,
      error: errorMessage,
    };
  }
}

export async function getLandingPage(
  slug: string = "/"
): Promise<LandingPage | null> {
  if (!client) {
    throw new Error(
      clientSetup.error || "Error de configuración de Contentful"
    );
  }

  try {
    const response = await client.getEntries({
      content_type: "landingPage",
      "fields.slug": slug,
      limit: 1,
      include: 4,
    });

    if (response.items.length === 0) {
      return null;
    }
    const landingPage = response.items[0].fields as unknown as LandingPage;

    // Add parentLandingSlug to dynamic pages if they exist
    if (landingPage.dynamicPages) {
      landingPage.dynamicPages = landingPage.dynamicPages.map((page) => ({
        ...page,
        fields: {
          ...page.fields,
          parentLandingSlug: landingPage.slug,
        },
      }));
    }

    return landingPage;
  } catch (error) {
    console.error("Error al obtener la landing page:", error);
    throw error;
  }
}

export async function getDynamicPage(
  slug: string,
  parentSlug?: string
): Promise<DynamicPage | null> {
  if (!client) {
    throw new Error(
      clientSetup.error || "Error de configuración de Contentful"
    );
  }

  try {
    // Si estamos en la ruta /blog/[slug], buscamos específicamente blogs
    if (parentSlug === "blog") {
      const response = await client.getEntries({
        content_type: "dynamicPage",
        "fields.slug": slug,
        "fields.location": "blog",
        limit: 1,
        include: 4,
      });

      if (response.items.length > 0) {
        return response.items[0].fields as unknown as DynamicPage;
      }
      return null;
    }

    // Para otras rutas, mantenemos la exclusión de blogs
    if (parentSlug) {
      const parentLanding = await getLandingPage(parentSlug);
      if (parentLanding?.dynamicPages) {
        const dynamicPage = parentLanding.dynamicPages.find(
          (page) => page.fields.slug === slug && page.fields.location !== "blog"
        );
        if (dynamicPage) {
          return {
            ...dynamicPage.fields,
            parentLandingSlug: parentLanding.slug,
          } as DynamicPage;
        }
      }
    }

    // Búsqueda global excluyendo blogs
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.slug": slug,
      "fields.location[ne]": "blog",
      limit: 1,
      include: 4,
    });

    if (response.items.length === 0) {
      return null;
    }

    return response.items[0].fields as unknown as DynamicPage;
  } catch (error) {
    console.error("Error fetching dynamic page:", error);
    return null;
  }
}

export async function getLegalPages(): Promise<DynamicPage[]> {
  try {
    const response = await client?.getEntries({
      content_type: "dynamicPage",
      "fields.location": "legal",
      "fields.isVisible": true,
    });

    return response?.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];
  } catch (error) {
    console.error("Error fetching legal pages:", error);
    return [];
  }
}

export async function getNavigationPages(): Promise<DynamicPage[]> {
  if (!client) {
    throw new Error(
      clientSetup.error || "Error de configuración de Contentful"
    );
  }

  try {
    // Get all landing pages to collect their dynamic pages
    const landingPagesResponse = await client.getEntries({
      content_type: "landingPage",
      include: 4,
    });

    const landingPages = landingPagesResponse.items.map(
      (item) => item.fields as unknown as LandingPage
    );

    // Collect and process dynamic pages from landing pages
    const landingPageDynamicPages: DynamicPage[] = [];
    landingPages.forEach((landing) => {
      if (landing.dynamicPages) {
        const pages = landing.dynamicPages.map((page) => ({
          ...page.fields,
          parentLandingSlug: landing.slug,
        })) as DynamicPage[];
        landingPageDynamicPages.push(...pages);
      }
    });

    // Return combined pages
    return [...landingPageDynamicPages];
  } catch (error) {
    console.error("Error al obtener las páginas de navegación:", error);
    throw error;
  }
}

export async function getBlogs(
  page: number = 1,
  limit: number = 6
): Promise<{ blogs: DynamicPage[]; total: number }> {
  try {
    const response = await client?.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
      limit,
      skip: (page - 1) * limit,
      include: 2,
    });

    const blogs = response?.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];

    return {
      blogs,
      total: response?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return { blogs: [], total: 0 };
  }
}

export async function getRecentBlogs(
  limit: number = 3
): Promise<DynamicPage[]> {
  try {
    const response = await client?.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
      limit,
      include: 2,
    });

    return response?.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const response = await client?.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
    });

    const allTags = response?.items.reduce((tags: string[], item: any) => {
      const itemTags = item.fields.tags || [];
      return [...tags, ...itemTags];
    }, []);

    return Array.from(new Set(allTags));
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}
