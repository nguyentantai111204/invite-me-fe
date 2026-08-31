import { IconName } from "@/components/shared/icon/icon-custom.interface";

export type SeasonalEffectType =
  | "none"
  | "tet"
  | "noel"
  | "wedding"
  | "sakura"
  | "fireworks";

export interface IBgmMusicConfig {
  enabled: boolean;
  url: string;
  autoPlay?: boolean;
  title?: string;
}

export interface IFestivalBannerConfig {
  enabled: boolean;
  text: string;
  link?: string;
  linkText?: string;
  badge?: string;
  bgColor?: string;
}

export interface IAtmosphereConfig {
  effect: SeasonalEffectType;
  bgMusic?: IBgmMusicConfig;
  festivalBanner?: IFestivalBannerConfig;
}

export type BlockType =
  | "HERO"
  | "FEATURES"
  | "TEMPLATES_SHOWCASE"
  | "HOW_IT_WORKS"
  | "TESTIMONIALS"
  | "PRICING"
  | "CTA_BANNER"
  | "CUSTOM_HTML";

export interface IBlockStyles {
  backgroundColor?: string;
  bgGradient?: string;
  paddingY?: number;
  containerMaxWidth?: "sm" | "md" | "lg" | "xl" | false;
}

export interface IBaseBlock<TData = any> {
  id: string;
  type: BlockType;
  order: number;
  isActive: boolean;
  styles?: IBlockStyles;
  data: TData;
}

export interface IButtonConfig {
  text: string;
  link: string;
  variant?: "primary" | "secondary" | "gradient" | "outline" | "ghost" | "dark";
  iconName?: IconName;
  show: boolean;
}

export interface IHeroBlockData {
  badgeText?: string;
  title: string;
  highlightText?: string;
  subtitle: string;
  align?: "left" | "center" | "right";
  primaryButton: IButtonConfig;
  secondaryButton: IButtonConfig;
  stats?: Array<{
    value: string;
    label: string;
  }>;
  previewCard?: {
    brideName: string;
    groomName: string;
    weddingDate: string;
    venue: string;
    coverImage: string;
  };
}

export interface IFeatureItem {
  id: string;
  iconName: IconName;
  title: string;
  description: string;
  badge?: string;
  colorVariant?: "gold" | "rose" | "primary";
}

export interface IFeaturesBlockData {
  badge?: string;
  title: string;
  subtitle: string;
  columns?: 2 | 3 | 4;
  features: IFeatureItem[];
}

export interface ITemplateItem {
  id: string;
  title: string;
  category: string;
  image: string;
  isNew?: boolean;
  isPopular?: boolean;
  demoSlug: string;
}

export interface ITemplatesBlockData {
  badge?: string;
  title: string;
  subtitle: string;
  categories: string[];
  templates: ITemplateItem[];
  viewAllButton?: IButtonConfig;
}

export interface IStepItem {
  stepNumber: number;
  title: string;
  description: string;
  iconName: IconName;
}

export interface IHowItWorksBlockData {
  badge?: string;
  title: string;
  subtitle: string;
  steps: IStepItem[];
  ctaButton?: IButtonConfig;
}

export interface IPricingFeature {
  text: string;
  included: boolean;
}

export interface IPricingPlan {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  period: string;
  description: string;
  isPopular?: boolean;
  badge?: string;
  features: IPricingFeature[];
  button: IButtonConfig;
}

export interface IPricingBlockData {
  badge?: string;
  title: string;
  subtitle: string;
  plans: IPricingPlan[];
}

export interface ITestimonialItem {
  id: string;
  coupleName: string;
  avatar: string;
  event: string;
  comment: string;
  rating: number;
}

export interface ITestimonialsBlockData {
  badge?: string;
  title: string;
  subtitle: string;
  testimonials: ITestimonialItem[];
}

export interface ICtaBannerBlockData {
  title: string;
  subtitle: string;
  primaryButton: IButtonConfig;
  secondaryButton?: IButtonConfig;
  bgImage?: string;
}

export interface ICustomHtmlBlockData {
  htmlContent: string;
}

export interface IHomeCmsConfig {
  version: number;
  atmosphere: IAtmosphereConfig;
  blocks: IBaseBlock[];
}
