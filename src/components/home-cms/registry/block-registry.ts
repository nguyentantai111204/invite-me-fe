import React from "react";
import { BlockType } from "@/interfaces/home-cms.interface";
import { HeroBlock } from "../blocks/hero-block";
import { FeaturesBlock } from "../blocks/features-block";
import { TemplatesShowcaseBlock } from "../blocks/templates-showcase-block";
import { HowItWorksBlock } from "../blocks/how-it-works-block";
import { PricingBlock } from "../blocks/pricing-block";
import { TestimonialsBlock } from "../blocks/testimonials-block";
import { CtaBannerBlock } from "../blocks/cta-banner-block";
import { CustomHtmlBlock } from "../blocks/custom-html-block";

export const BLOCK_REGISTRY: Record<
  BlockType,
  React.ComponentType<{ data: any; styles?: any }>
> = {
  HERO: HeroBlock,
  FEATURES: FeaturesBlock,
  TEMPLATES_SHOWCASE: TemplatesShowcaseBlock,
  HOW_IT_WORKS: HowItWorksBlock,
  PRICING: PricingBlock,
  TESTIMONIALS: TestimonialsBlock,
  CTA_BANNER: CtaBannerBlock,
  CUSTOM_HTML: CustomHtmlBlock,
};
