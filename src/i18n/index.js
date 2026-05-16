import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/common.json";
import mn from "./locales/mn/common.json";
import cz from "./locales/cz/common.json";

const getInitialLanguage = () => {
  if (typeof window === "undefined") return "en";
  return window.localStorage.getItem("lang") || "en";
};

const resources = {
  en: { common: en },
  mn: { common: mn },
  cz: { common: cz },
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: { escapeValue: false },
  });
}

export default i18n;
