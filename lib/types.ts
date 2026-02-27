export type ColorOption =
  | "white"
  | "black"
  | "gold"
  | "yellow"
  | "red"
  | "green"
  | "whatsapp_green"
  | "blue"
  | "cyan"
  | "orange"
  | "pink"
  | "purple"
  | "gray_light"
  | "gray_dark";

export type BackgroundMode = "single" | "rotating";

export interface LandingThemeConfig {
  backgroundMode: BackgroundMode;
  backgroundImages: string[];
  rotateEveryHours: number;
  logoUrl: string;
  titleLine1: string;
  titleLine2: string;
  subtitleLine1: string;
  subtitleLine2: string;
  subtitleLine3: string;
  footerBadgeText: string;
  ctaText: string;
  titleColor: ColorOption;
  subtitleColor: ColorOption;
  footerBadgeColor: ColorOption;
  ctaTextColor: ColorOption;
  ctaBackgroundColor: ColorOption;
  ctaGlowColor: ColorOption;
}

