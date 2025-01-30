"use client";

import { useState } from "react";
import Link from "next/link";
import { DynamicPage } from "@/types/contentful";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";

interface BlogListProps {
  blogs: DynamicPage[];
  total: number;
  categories: string[];
}

function getFirstParagraph(content: any): string {
  if (!content || !content.content) return "";

  const firstParagraph = content.content.find(
    (node: any) => node.nodeType === BLOCKS.PARAGRAPH
  );

  if (firstParagraph && firstParagraph.content) {
    const text = firstParagraph.content
      .map((item: any) => item.value || "")
      .join("");
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
  }

  return "";
}

export function BlogList({ blogs, total, categories }: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const ITEMS_PER_PAGE = 6;

  // Filtrar blogs por categoría
  const filteredBlogs = selectedCategory
    ? blogs.filter((blog) => blog.tags?.includes(selectedCategory))
    : blogs;

  // Calcular blogs para la página actual
  const indexOfLastBlog = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstBlog = indexOfLastBlog - ITEMS_PER_PAGE;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / ITEMS_PER_PAGE);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setCurrentPage(1);
          }}
          className={`text-sm px-3 py-1 rounded-full transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-muted/80"
          }`}
        >
          Todos
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`text-sm px-3 py-1 rounded-full transition-colors ${
              selectedCategory === category
                ? "bg-primary text-primary-foreground"
                : "bg-muted hover:bg-muted/80"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {currentBlogs.map((blog) => (
        <article
          key={blog.slug}
          className="card-gradient rounded-lg py-4 px-10 transition-all hover:scale-[1.02]"
        >
          <h2 className="text-2xl font-bold py-5">
            <Link href={`/blog/${blog.slug}`}>{blog.title}</Link>
          </h2>
          {blog.featuredImage && (
            <Link href={`/blog/${blog.slug}`}>
              <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
                <img
                  src={`https:${blog.featuredImage.fields.file.url}`}
                  alt={blog.featuredImage.fields.title}
                  className="object-cover"
                />
              </div>
            </Link>
          )}
          <div className="space-y-4">
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              {blog.author && <span>{blog.author}</span>}
              {blog.publishDate && (
                <time dateTime={blog.publishDate}>
                  {formatDate(blog.publishDate)}
                </time>
              )}
            </div>

            {blog.content && (
              <p className="text-foreground/80">
                {getFirstParagraph(blog.content)}
              </p>
            )}
            <div className="flex flex-wrap gap-2">
              {blog.tags?.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setSelectedCategory(tag);
                    setCurrentPage(1);
                  }}
                  className="text-sm bg-muted px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <Button asChild variant="default">
                <Link href={`/blog/${blog.slug}`}>Leer más →</Link>
              </Button>
            </div>
          </div>
        </article>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentPage === page
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
