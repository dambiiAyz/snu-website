import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import ProductDetailsArea from "@/components/product-details/product-details-area";
import Footer from "@/layout/footers/footer";
import { getShareProduct } from "./share-product";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getShareProduct(id);
  const title = product?.title?.trim();
  if (!title) return {};

  const description = product.description?.trim() || "Snuu онлайн дэлгүүр";
  const url = `/product-details/${encodeURIComponent(id)}`;

  const image = url + "/share-image";

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
      images: [{ url: image, width: 1200, height: 630, type: "image/jpeg", alt: title }],
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
