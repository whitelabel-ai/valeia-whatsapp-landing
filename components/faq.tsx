"use client";

import { FaqSection } from "@/types/contentful";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultMarkdownComponents } from "./ui/markdown-components";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface FaqProps {
  content: FaqSection;
}

export function Faq({ content }: FaqProps) {
  const { title, subtitle, faqs, isVisible, columns = 1, sectionId } = content;
  const [activeItem, setActiveItem] = useState<string | undefined>();

  if (!isVisible || !faqs || !Array.isArray(faqs)) return null;

  // Filtrar preguntas válidas
  const validFaqs = faqs.filter(
    (faq) => faq?.fields?.question && faq?.fields?.answer
  );

  if (validFaqs.length === 0) return null;

  // Si hay dos columnas, dividimos las preguntas en dos arrays
  const faqsPerColumn =
    columns === 2 ? Math.ceil(validFaqs.length / 2) : validFaqs.length;
  const firstColumnFaqs = validFaqs.slice(0, faqsPerColumn);
  const secondColumnFaqs = validFaqs.slice(faqsPerColumn);

  const handleValueChange = (value: string) => {
    setActiveItem(value === activeItem ? undefined : value);
  };

  const renderFaqColumn = (columnFaqs: typeof validFaqs) => (
    <Accordion
      type="single"
      value={activeItem}
      onValueChange={handleValueChange}
      className="w-full"
      collapsible
    >
      {columnFaqs.map((faq, index) => {
        const itemValue = `item-${faq.sys.id}`;
        const isActive = activeItem === itemValue;

        return (
          <AccordionItem
            key={faq.sys.id}
            value={itemValue}
            className="border-b border-border"
          >
            <AccordionTrigger
              className={cn(
                "text-left text-base md:text-lg font-medium py-4 hover:no-underline transition-colors",
                "hover:text-primary",
                isActive && "text-primary",
                !isActive && "text-foreground"
              )}
            >
              {faq.fields.question}
            </AccordionTrigger>
            <AccordionContent className="text-foreground/80 text-base py-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={defaultMarkdownComponents}
                className="prose prose-invert max-w-none"
              >
                {faq.fields.answer}
              </ReactMarkdown>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );

  return (
    <section id={sectionId} className="py-24 relative">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className={`mx-auto ${
            columns === 2 ? "grid md:grid-cols-2 gap-8 md:gap-12" : "max-w-3xl"
          }`}
        >
          {renderFaqColumn(firstColumnFaqs)}
          {columns === 2 &&
            secondColumnFaqs.length > 0 &&
            renderFaqColumn(secondColumnFaqs)}
        </div>
      </div>
    </section>
  );
}
