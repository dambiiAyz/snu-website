import { getDefaultVariant } from "@/utils/utils";

export async function getShareProduct(id) {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return null;

  try {
    const response = await fetch(
      `${apiBase.replace(/\/+$/, "")}/api/product/single-product/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  }
}

export function getShareImage(product) {
  const variants = Array.isArray(product.imageURLs)
    ? product.imageURLs.filter((variant) => typeof variant?.img === "string" && variant.img.trim())
    : [];
  return getDefaultVariant(variants)?.img.trim() || "/assets/img/logo/snu_logo_comp.png";
}
