"use client";

import Link from "next/link";
import Image from "next/image";
import { DynamicPage } from "@/types/contentful";
import { formatDate } from "@/lib/utils";

interface BlogSidebarProps {
  categories: string[];
  recentBlogs: DynamicPage[];
  selectedCategory?: string;
}

export function BlogSidebar({
  categories,
  recentBlogs,
  selectedCategory,
}: BlogSidebarProps) {
  return (
    <aside className="space-y-8">
      {/* Categorías */}
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Categorías</h2>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Posts Recientes */}
      <div className="card-gradient rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Posts Recientes</h2>
        <div className="space-y-4">
          {recentBlogs.map((blog) => (
            <article key={blog.slug} className="group">
              <Link href={`/blog/${blog.slug}`} className="flex gap-4">
                {blog.featuredImage && (
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={`https:${blog.featuredImage.fields.file.url}`}
                      alt={blog.featuredImage.fields.title}
                      className="object-cover w-full h-full transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-foreground/60 mt-2">
                    {blog.author && <span>{blog.author}</span>}
                    {blog.publishDate && (
                      <time dateTime={blog.publishDate}>
                        {formatDate(blog.publishDate)}
                      </time>
                    )}
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </aside>
  );
}
