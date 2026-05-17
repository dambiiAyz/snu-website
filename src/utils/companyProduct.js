/**
 * Normalize company slug from a product (backend may populate `company`, or set flat fields).
 * @param {Record<string, unknown>} product
 * @returns {{ name?: string; slug?: string } | null}
 */
export function getProductCompany(product) {
  if (!product || typeof product !== "object") return null;
  const c = product.company;
  if (c && typeof c === "object") {
    const slug = c.slug || c.slugUrl;
    const name = c.name;
    if (slug || name) return { slug: slug ? String(slug) : undefined, name: name ? String(name) : undefined };
  }
  if (product.companySlug) {
    return {
      slug: String(product.companySlug),
      name: product.companyName ? String(product.companyName) : undefined,
    };
  }
  return null;
}

export function productMatchesCompanySlug(product, slug) {
  if (!slug) return true;
  const want = String(slug).trim().toLowerCase();
  if (!want) return true;
  const info = getProductCompany(product);
  if (!info?.slug) return false;
  return String(info.slug).trim().toLowerCase() === want;
}

export function filterProductsByCompanySlug(products, slug) {
  if (!slug) return products || [];
  return (products || []).filter((p) => productMatchesCompanySlug(p, slug));
}
