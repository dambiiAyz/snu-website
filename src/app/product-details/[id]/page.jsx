import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import Footer from "@/layout/footers/footer";
import { getDefaultVariant } from "@/utils/utils";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) return {};

  let product;
  try {
    const response = await fetch(
      `${apiBase.replace(/\/+$/, "")}/api/product/single-product/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 }, signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) return {};
    product = await response.json();
  } catch {
    return {};
  }

  const title = product?.title?.trim();
  if (!title) return {};

  const variants = Array.isArray(product.imageURLs)
    ? product.imageURLs.filter((variant) => typeof variant?.img === "string" && variant.img.trim())
    : [];
  const image = getDefaultVariant(variants)?.img.trim() || "/assets/img/logo/snu_logo_comp.png";
  const description = product.description?.trim() || "Snuu онлайн дэлгүүр";
  const url = `/product-details/${encodeURIComponent(id)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "Snuu онлайн дэлгүүр",
      locale: "mn_MN",
      images: [{ url: image, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function ProductDetailsPage({ params }) {
  const { id } = await params;
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ProductDetailsArea id={id} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
