import { Theme } from "@/types/contentful";

interface ThemeConfig {
  background: string;
  foreground: string;
  primary: string;
  primaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  cardGradient: string;
  textGradient: string;
  backgroundGradient: string;
}

export const themeConfigs: Record<Theme, ThemeConfig> = {
  defaultLight: {
    background: "220 25% 97%",
    foreground: "220 45% 15%",
    primary: "250 95% 60%",
    primaryForeground: "0 0% 100%",
    muted: "220 25% 92%",
    mutedForeground: "220 45% 40%",
    accent: "250 95% 60%",
    accentForeground: "0 0% 100%",
    border: "220 25% 88%",
    cardGradient:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.08) 0%, rgba(139, 92, 246, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(124, 58, 237, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  defaultDark: {
    background: "224 71% 4%",
    foreground: "213 31% 91%",
    primary: "250 95% 60%",
    primaryForeground: "0 0% 100%",
    muted: "223 47% 11%",
    mutedForeground: "215.4 16.3% 56.9%",
    accent: "250 95% 60%",
    accentForeground: "0 0% 100%",
    border: "216 34% 17%",
    cardGradient:
      "linear-gradient(135deg, rgba(124, 58, 237, 0.1), rgba(0, 0, 0, 0))",
    textGradient: "linear-gradient(to right, #7c3aed, #8b5cf6)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  cosmicLight: {
    background: "222 40% 95%",
    foreground: "222 40% 15%",
    primary: "263 85% 60%",
    primaryForeground: "0 0% 100%",
    muted: "222 40% 90%",
    mutedForeground: "222 40% 40%",
    accent: "263 85% 60%",
    accentForeground: "0 0% 100%",
    border: "222 40% 85%",
    cardGradient:
      "linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #6366f1, #a855f7)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(99, 102, 241, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  cosmicDark: {
    background: "222 47% 5%",
    foreground: "210 40% 98%",
    primary: "263 85% 60%",
    primaryForeground: "0 0% 100%",
    muted: "217 47% 11%",
    mutedForeground: "215 20% 65%",
    accent: "263 85% 60%",
    accentForeground: "0 0% 100%",
    border: "217 34% 17%",
    cardGradient:
      "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #6366f1, #a855f7)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  midnightLight: {
    background: "232 40% 96%",
    foreground: "232 47% 15%",
    primary: "224 64% 33%",
    primaryForeground: "0 0% 100%",
    muted: "232 40% 91%",
    mutedForeground: "232 47% 40%",
    accent: "224 64% 33%",
    accentForeground: "0 0% 100%",
    border: "232 40% 86%",
    cardGradient:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.08) 0%, rgba(37, 99, 235, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #1e3a8a, #2563eb)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(30, 58, 138, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  midnightDark: {
    background: "232 47% 3%",
    foreground: "213 31% 91%",
    primary: "224 64% 33%",
    primaryForeground: "0 0% 100%",
    muted: "232 47% 8%",
    mutedForeground: "215 20% 65%",
    accent: "224 64% 33%",
    accentForeground: "0 0% 100%",
    border: "232 47% 12%",
    cardGradient:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.1) 0%, rgba(37, 99, 235, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #1e3a8a, #2563eb)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(30, 58, 138, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  sunsetLight: {
    background: "20 30% 96%",
    foreground: "20 14% 15%",
    primary: "20 90% 50%",
    primaryForeground: "0 0% 100%",
    muted: "20 30% 91%",
    mutedForeground: "20 14% 40%",
    accent: "20 90% 50%",
    accentForeground: "0 0% 100%",
    border: "20 30% 86%",
    cardGradient:
      "linear-gradient(135deg, rgba(249, 115, 22, 0.08) 0%, rgba(239, 68, 68, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #f97316, #ef4444)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(249, 115, 22, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  sunsetDark: {
    background: "20 14% 4%",
    foreground: "0 0% 98%",
    primary: "20 90% 50%",
    primaryForeground: "0 0% 100%",
    muted: "20 14% 9%",
    mutedForeground: "20 14% 65%",
    accent: "20 90% 50%",
    accentForeground: "0 0% 100%",
    border: "20 14% 14%",
    cardGradient:
      "linear-gradient(135deg, rgba(249, 115, 22, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #f97316, #ef4444)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(249, 115, 22, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  forestLight: {
    background: "150 30% 96%",
    foreground: "150 14% 15%",
    primary: "142 71% 45%",
    primaryForeground: "0 0% 100%",
    muted: "150 30% 91%",
    mutedForeground: "150 14% 40%",
    accent: "142 71% 45%",
    accentForeground: "0 0% 100%",
    border: "150 30% 86%",
    cardGradient:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(16, 185, 129, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #22c55e, #10b981)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(34, 197, 94, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  forestDark: {
    background: "150 14% 4%",
    foreground: "0 0% 98%",
    primary: "142 71% 45%",
    primaryForeground: "0 0% 100%",
    muted: "150 14% 9%",
    mutedForeground: "150 14% 65%",
    accent: "142 71% 45%",
    accentForeground: "0 0% 100%",
    border: "150 14% 14%",
    cardGradient:
      "linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(16, 185, 129, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #22c55e, #10b981)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(34, 197, 94, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  oceanLight: {
    background: "201 30% 96%",
    foreground: "201 100% 15%",
    primary: "199 89% 48%",
    primaryForeground: "0 0% 100%",
    muted: "201 30% 91%",
    mutedForeground: "201 100% 40%",
    accent: "199 89% 48%",
    accentForeground: "0 0% 100%",
    border: "201 30% 86%",
    cardGradient:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(59, 130, 246, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #06b6d4, #3b82f6)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(6, 182, 212, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  oceanDark: {
    background: "201 100% 3%",
    foreground: "0 0% 98%",
    primary: "199 89% 48%",
    primaryForeground: "0 0% 100%",
    muted: "201 100% 8%",
    mutedForeground: "201 100% 65%",
    accent: "199 89% 48%",
    accentForeground: "0 0% 100%",
    border: "201 100% 12%",
    cardGradient:
      "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #06b6d4, #3b82f6)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(6, 182, 212, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  auroraLight: {
    background: "280 30% 96%",
    foreground: "280 14% 15%",
    primary: "280 90% 50%",
    primaryForeground: "0 0% 100%",
    muted: "280 30% 91%",
    mutedForeground: "280 14% 40%",
    accent: "280 90% 50%",
    accentForeground: "0 0% 100%",
    border: "280 30% 86%",
    cardGradient:
      "linear-gradient(135deg, rgba(192, 132, 252, 0.08) 0%, rgba(168, 85, 247, 0.08) 100%)",
    textGradient: "linear-gradient(to right, #c084fc, #a855f7)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(192, 132, 252, 0.12) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  aurora: {
    background: "280 14% 4%",
    foreground: "0 0% 98%",
    primary: "280 90% 50%",
    primaryForeground: "0 0% 100%",
    muted: "280 14% 9%",
    mutedForeground: "280 14% 65%",
    accent: "280 90% 50%",
    accentForeground: "0 0% 100%",
    border: "280 14% 14%",
    cardGradient:
      "linear-gradient(135deg, rgba(192, 132, 252, 0.1) 0%, rgba(168, 85, 247, 0.1) 100%)",
    textGradient: "linear-gradient(to right, #c084fc, #a855f7)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(192, 132, 252, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
  },
  sepia: {
    background: "40 50% 98%",
    foreground: "40 40% 8%",
    primary: "32 95% 44%",
    primaryForeground: "0 0% 100%",
    muted: "40 50% 93%",
    mutedForeground: "40 40% 40%",
    accent: "32 95% 44%",
    accentForeground: "0 0% 100%",
    border: "40 50% 88%",
    cardGradient:
      "linear-gradient(135deg, rgba(180, 83, 9, 0.05) 0%, rgba(146, 64, 14, 0.05) 100%)",
    textGradient: "linear-gradient(to right, #b45309, #92400e)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(180, 83, 9, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
  },
  moonlight: {
    background: "230 25% 98%",
    foreground: "230 25% 8%",
    primary: "230 75% 50%",
    primaryForeground: "0 0% 100%",
    muted: "230 25% 93%",
    mutedForeground: "230 25% 40%",
    accent: "230 75% 50%",
    accentForeground: "0 0% 100%",
    border: "230 25% 88%",
    cardGradient:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.05) 100%)",
    textGradient: "linear-gradient(to right, #3b82f6, #2563eb)",
    backgroundGradient:
      "radial-gradient(circle at center, rgba(59, 130, 246, 0.08) 0%, rgba(255, 255, 255, 0) 70%)",
  },
};
