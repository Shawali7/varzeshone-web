

import faAF from "./locales/fa-AF.json";
import psAF from "./locales/ps-AF.json";
import en from "./locales/en.json";

import type { AppLanguage } from "./types";

export type { AppLanguage } from "./types";

const translations = {
  "fa-AF": faAF,
  "ps-AF": psAF,
  en,
} as const;

export type TranslationKey = keyof typeof faAF;

export function translate(
  language: AppLanguage,
  key: TranslationKey,
): string {
  return translations[language][key] ?? translations["fa-AF"][key];
}
