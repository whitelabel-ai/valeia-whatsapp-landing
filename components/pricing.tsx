import { Check } from "lucide-react";
import { Button } from "./ui/button";
import { PricingSection } from "@/types/contentful";
import Link from "next/link";

interface PricingProps {
  content: PricingSection;
}

export function Pricing({ content }: PricingProps) {
  const { title, subtitle, plans, isVisible } = content;

  if (!isVisible) return null;

  return (
    <section id="precios" className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.fields.name}
              className={`card-gradient rounded-lg p-6 flex flex-col justify-between relative ${
                plan.fields.highlightedText ? "ring-2 ring-primary" : ""
              }`}
            >
              {plan.fields.highlightedText && plan.fields.promotionalText && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-white text-sm font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.fields.promotionalText}
                  </span>
                </div>
              )}

              <div>
                <h3 className="text-xl md:text-2xl font-bold mb-2">
                  {plan.fields.name}
                </h3>
                <div className="mb-4">
                  <span className="text-3xl md:text-4xl font-bold">
                    {plan.fields.price}
                  </span>
                </div>
                <p className="text-foreground/80 mb-6 text-sm md:text-base">
                  {plan.fields.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {plan.fields.features?.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                      <span className="text-foreground/80 text-sm md:text-base">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {plan.fields.payLink && plan.fields.payLinkText && (
                <Button
                  asChild
                  className="w-full mt-auto"
                  variant={plan.fields.highlightedText ? "default" : "outline"}
                >
                  <Link href={plan.fields.payLink}>
                    {plan.fields.payLinkText}
                  </Link>
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
