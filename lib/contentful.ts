import { createClient } from "contentful";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";
import { DynamicPage, LandingPage } from "@/types/contentful";
import { Document } from "@contentful/rich-text-types";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
});

export async function getLandingPage(): Promise<LandingPage | null> {
  try {
    const response = await client.getEntries({
      content_type: "landingPage",
      "fields.slug": "/",
      limit: 1,
      include: 4,
    });

    if (response.items.length === 0) {
      return null;
    }
    return response.items[0].fields as unknown as LandingPage;
  } catch (error) {
    console.error("Error fetching landing page:", error);
    return null;
  }
}

export async function getDynamicPage(
  slug: string
): Promise<DynamicPage | null> {
  try {
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.slug": slug,
      limit: 1,
      include: 2,
    });

    if (response.items.length === 0) {
      return null;
    }

    const page = response.items[0].fields as unknown as DynamicPage;
    return { ...page };
  } catch (error) {
    console.error("Error fetching dynamic page:", error);
    return null;
  }
}

export async function getLegalPages(): Promise<DynamicPage[]> {
  try {
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.location": "legal",
      "fields.isVisible": true,
    });

    return response.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];
  } catch (error) {
    console.error("Error fetching legal pages:", error);
    return [];
  }
}

export async function getNavigationPages(): Promise<DynamicPage[]> {
  try {
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.isVisible": true,
      "fields.location[exists]": true,
    });

    return response.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];
  } catch (error) {
    console.error("Error fetching navigation pages:", error);
    return [];
  }
}

export async function getBlogs(
  page: number = 1,
  limit: number = 6
): Promise<{ blogs: DynamicPage[]; total: number }> {
  try {
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
      limit,
      skip: (page - 1) * limit,
      include: 2,
    });

    const blogs = response.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];

    return {
      blogs,
      total: response.total,
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
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
      limit,
      include: 2,
    });

    return response.items.map((item) => ({
      ...item.fields,
    })) as unknown as DynamicPage[];
  } catch (error) {
    console.error("Error fetching recent blogs:", error);
    return [];
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const response = await client.getEntries({
      content_type: "dynamicPage",
      "fields.location": "blog",
      "fields.isVisible": true,
    });

    const allTags = response.items.reduce((tags: string[], item: any) => {
      const itemTags = item.fields.tags || [];
      return [...tags, ...itemTags];
    }, []);

    return Array.from(new Set(allTags));
  } catch (error) {
    console.error("Error fetching blog categories:", error);
    return [];
  }
}
