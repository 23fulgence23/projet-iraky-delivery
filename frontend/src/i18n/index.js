import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en.json";
import mg from "./locales/mg.json";

export const LANGUES = ["fr", "en", "mg"];

let initiale = "fr";
try {
  const s = localStorage.getItem("langue");
  if (LANGUES.includes(s)) initiale = s;
} catch {}

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: {} },
    en: { translation: en },
    mg: { translation: mg },
  },
  lng: initiale,
  fallbackLng: "fr",
  keySeparator: false,
  nsSeparator: false,
  returnEmptyString: false,
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (l) => {
  try { localStorage.setItem("langue", l); } catch {}
  document.documentElement.lang = l;
});
document.documentElement.lang = initiale;

export default i18n;
