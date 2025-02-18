"use client";

import { Check, Ticket } from "lucide-react";
import { Button } from "./ui/button";
import { PricingSection } from "@/types/contentful";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { defaultMarkdownComponents } from "./ui/markdown-components";
import { useState, useEffect } from "react";
import { CouponModal } from "./ui/coupon-modal";
import { extractPriceInfo } from "@/lib/price-utils";

interface PricingProps {
  content: PricingSection;
}

export function Pricing({ content }: PricingProps) {
  const { title, subtitle, plans, isVisible, couponsEndpoint, sectionId } =
    content;
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [appliedDiscounts, setAppliedDiscounts] = useState<{
    [key: number]: number;
  }>({});

  if (!isVisible || !plans) return null;

  const validPlans = plans.filter(
    (plan) => plan.fields?.name && plan.fields?.price
  );

  if (validPlans.length === 0) return null;

  const handleApplyCoupon = (planIndex: number, discount: number) => {
    setAppliedDiscounts((prev) => ({
      ...prev,
      [planIndex]: discount,
    }));
  };

  const calculateDiscountedPrice = (price: string, discount?: number) => {
    const { amount, currency } = extractPriceInfo(price);
    if (!discount) return price;
    const discountedAmount = amount - (amount * discount) / 100;
    return `${discountedAmount.toFixed(2)} ${currency}`;
  };

  const handlePaymentClick = (plan: any, index: number) => {
    if (plan.fields.enableCoupons && !appliedDiscounts[index]) {
      setSelectedPlan(index);
      setIsCouponModalOpen(true);
    } else if (plan.fields.payLink) {
      const { amount } = extractPriceInfo(plan.fields.price);
      const discount = appliedDiscounts[index];
      const finalAmount = discount
        ? amount - (amount * discount) / 100
        : amount;

      window.location.href = `${plan.fields.payLink}${
        discount ? `?discount=${discount}&amount=${finalAmount}` : ""
      }`;
    }
  };

  const renderPaymentButton = (plan: any, index: number) => {
    if (plan.fields.paymentScript && appliedDiscounts[index]) {
      // Renderizar el script personalizado de pago
      return (
        <div
          dangerouslySetInnerHTML={{ __html: plan.fields.paymentScript }}
          className="w-full"
        />
      );
    }

    return (
      <Button
        className="w-full"
        variant={plan.fields.highlightedText ? "default" : "outline"}
        onClick={() => handlePaymentClick(plan, index)}
      >
        {plan.fields.payLinkText || "Pagar ahora"}
      </Button>
    );
  };

  return (
    <section id={sectionId} className="py-24 relative">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-foreground/80 max-w-2xl mx-auto">{subtitle}</p>
        </div>

        <div
          className={`grid grid-cols-1 gap-8 justify-center w-full ${
            validPlans.length === 1
              ? "max-w-sm mx-auto"
              : validPlans.length === 2
                ? "md:grid-cols-2 max-w-3xl mx-auto"
                : validPlans.length === 3
                  ? "md:grid-cols-3 max-w-6xl mx-auto"
                  : "sm:grid-cols-2 md:grid-cols-4 max-w-6xl mx-auto"
          }`}
        >
          {validPlans.map((plan, index) => {
            const discount = appliedDiscounts[index];
            const currentPrice = calculateDiscountedPrice(
              plan.fields.price,
              discount
            );

            return (
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
                    {discount ? (
                      <div className="space-y-1">
                        <span className="text-lg line-through text-foreground/60">
                          {plan.fields.price}
                        </span>
                        <span className="text-3xl md:text-4xl font-bold block">
                          {currentPrice}
                        </span>
                        <span className="text-sm text-green-500">
                          {discount}% de descuento aplicado
                        </span>
                      </div>
                    ) : (
                      <span className="text-3xl md:text-4xl font-bold">
                        {currentPrice}
                      </span>
                    )}
                  </div>
                  <div className="prose prose-invert max-w-none mb-8">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={defaultMarkdownComponents}
                    >
                      {plan.fields.description}
                    </ReactMarkdown>
                  </div>
                  <ul className="space-y-3 mb-8">
                    {plan.fields.features?.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <span className="text-foreground/80 text-sm md:text-base">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  {plan.fields.enableCoupons && !discount && (
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedPlan(index);
                        setIsCouponModalOpen(true);
                      }}
                    >
                      <Ticket className="mr-2 h-4 w-4" />
                      Aplicar cupón
                    </Button>
                  )}

                  {renderPaymentButton(plan, index)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {selectedPlan !== null && (
        <CouponModal
          isOpen={isCouponModalOpen}
          onClose={() => {
            setIsCouponModalOpen(false);
            setSelectedPlan(null);
          }}
          onApplyCoupon={(discount) => {
            handleApplyCoupon(selectedPlan, discount);
          }}
          endpoint={couponsEndpoint}
          originalPrice={
            extractPriceInfo(validPlans[selectedPlan].fields.price).amount
          }
        />
      )}
    </section>
  );
}
