export const SHOP_COMPANY_SLUG_KEY = "snu_shop_company_slug";

export function getStoredShopCompanySlug() {
  if (typeof window === "undefined") return "";
  try {
    return (localStorage.getItem(SHOP_COMPANY_SLUG_KEY) || "").trim();
  } catch {
    return "";
  }
}

export function setStoredShopCompanySlug(slug) {
  if (typeof window === "undefined") return;
  const s = (slug || "").trim();
  try {
    if (s) localStorage.setItem(SHOP_COMPANY_SLUG_KEY, s);
    else localStorage.removeItem(SHOP_COMPANY_SLUG_KEY);
  } catch {
    // ignore
  }
}
