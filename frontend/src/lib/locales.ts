export const supportedLocales = ["en", "am"] as const;

export type Locale = (typeof supportedLocales)[number];

export const localeLabels: Record<Locale, string> = {
  en: "English",
  am: "አማርኛ",
};
