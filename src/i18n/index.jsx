import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { enPack } from "./packs/en";

const STORAGE_KEY = "market-pulse-language";
const packs = { en: enPack };
const fallbackLanguage = "en";

function resolvePath(target, path) {
  return path.split(".").reduce((acc, part) => {
    if (acc == null) return undefined;
    return acc[part];
  }, target);
}

function interpolate(text, vars = {}) {
  return text.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    const value = vars[key];
    return value == null ? "" : String(value);
  });
}

function pickInitialLanguage() {
  if (typeof window === "undefined") return fallbackLanguage;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored && packs[stored] ? stored : fallbackLanguage;
}

const I18nContext = createContext({
  language: fallbackLanguage,
  setLanguage: () => {},
  t: (key, vars, fallback) => fallback || key,
  get: () => undefined,
});

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(pickInitialLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    if (!packs[nextLanguage]) return;
    setLanguageState(nextLanguage);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    }
  }, []);

  const dictionary = packs[language] || packs[fallbackLanguage];

  const t = useCallback(
    (key, vars = {}, fallback = key) => {
      const value = resolvePath(dictionary, key);
      if (typeof value === "string") return interpolate(value, vars);
      if (value == null) return fallback;
      return value;
    },
    [dictionary],
  );

  const get = useCallback(
    (key, fallback = undefined) => {
      const value = resolvePath(dictionary, key);
      return value == null ? fallback : value;
    },
    [dictionary],
  );

  const contextValue = useMemo(
    () => ({ language, setLanguage, t, get }),
    [language, setLanguage, t, get],
  );

  return <I18nContext.Provider value={contextValue}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}

export const SUPPORTED_LANGUAGES = Object.keys(packs);
