"use client";

import { FaqSection } from "@/types/contentful";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqProps {
  content: FaqSection;
}

export function Faq({ content }: FaqProps) {
  const { title, subtitle, faqs, isVisible, columns = 1 } = content;

  if (!isVisible) return null;

  // Si hay dos columnas, dividimos las preguntas en dos arrays
  const faqsPerColumn =
    columns === 2 ? Math.ceil(faqs.length / 2) : faqs.length;
  const firstColumnFaqs = faqs.slice(0, faqsPerColumn);
  const secondColumnFaqs = faqs.slice(faqsPerColumn);

  const renderFaqColumn = (columnFaqs: typeof faqs) => (
    <Accordion type="single" collapsible className="w-full">
      {columnFaqs.map((faq, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-b border-border"
        >
          <AccordionTrigger className="text-left text-base md:text-lg font-medium py-4 hover:no-underline hover:text-primary">
            {faq.fields.question}
          </AccordionTrigger>
          <AccordionContent className="text-foreground/80 text-base py-4">
            {faq.fields.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );

  return (
    <section id="faq" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className={`max-w-6xl mx-auto ${
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
