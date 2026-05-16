export const LANGUAGES = [
  { code: "en", labelKey: "language.options.en", shortKey: "language.short.en" },
  { code: "mn", labelKey: "language.options.mn", shortKey: "language.short.mn" },
  { code: "cz", labelKey: "language.options.cz", shortKey: "language.short.cz" },
];

export const getLanguageShort = (t, code) => {
  const match = LANGUAGES.find((lang) => lang.code === code);
  return match ? t(match.shortKey) : code.toUpperCase();
};
