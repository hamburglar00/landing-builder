import type { ColorOption, LandingThemeConfig } from "./types";

export const COLOR_OPTIONS: ColorOption[] = [
  "white",
  "black",
  "gold",
  "yellow",
  "red",
  "green",
  "whatsapp_green",
  "blue",
  "cyan",
  "orange",
  "pink",
  "purple",
  "gray_light",
  "gray_dark"
];

export const COLOR_MAP: Record<ColorOption, string> = {
  white: "#FFFFFF",
  black: "#000000",
  gold: "#FFD700",
  yellow: "#FFF000",
  red: "#FF3B30",
  green: "#1FAF38",
  whatsapp_green: "#25D366",
  blue: "#007BFF",
  cyan: "#00D8FF",
  orange: "#FF8C00",
  pink: "#FF4FC3",
  purple: "#9B59B6",
  gray_light: "#D9D9D9",
  gray_dark: "#4A4A4A"
};

export const DEFAULT_CONFIG: LandingThemeConfig = {
  titleLine1: "Envianos un WhatsApp",
  titleLine2: "para crear tu cuenta",
  subtitleLine1: "Mínimo de carga: 1.000",
  subtitleLine2: "Sin Límite de retiro",
  subtitleLine3: "Ganás y cobrás a cualquier hora",
  footerBadgeText: "-RED OFICIAL-",
  ctaText: "¡Contactar ya!",
  titleColor: "white",
  subtitleColor: "white",
  footerBadgeColor: "yellow",
  ctaTextColor: "white",
  ctaBackgroundColor: "green",
  ctaGlowColor: "yellow",
  backgroundMode: "single",
  backgroundImages: [],
  rotateEveryHours: 24,
  logoUrl: ""
};

export const createDefaultConfig = (): LandingThemeConfig => ({
  ...DEFAULT_CONFIG,
  backgroundImages: [...DEFAULT_CONFIG.backgroundImages]
});

