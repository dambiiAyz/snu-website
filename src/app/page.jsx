import Wrapper from "@/layout/wrapper";
import Header from "@/layout/headers/header";
import HomeHeroSlider from "@/components/hero-banner/home-hero-slider";
import BannerArea from "@/components/banner/banner-area";
import BlogArea from "@/components/blog/electronic/blog-area";
import ElectronicCategory from "@/components/categories/electronic-category";
import CtaArea from "@/components/cta/cta-area";
import FeatureArea from "@/components/features/feature-area";
import InstagramArea from "@/components/instagram/instagram-area";
import NewArrivals from "@/components/products/electronics/new-arrivals";
import OfferProducts from "@/components/products/electronics/offer-products";
import ProductArea from "@/components/products/electronics/product-area";
import ProductBanner from "@/components/products/electronics/product-banner";
import ProductGadgetArea from "@/components/products/electronics/product-gadget-area";
import ProductSmArea from "@/components/products/electronics/product-sm-area";
import Footer from "@/layout/footers/footer";


async function getHomeCovers() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!baseUrl) return null;
  try {
    const response = await fetch(`${baseUrl.replace(/\/+$/, "")}/api/home-covers`, {
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(4000),
    });
    if (!response.ok) return null;
    const data = await response.json();
    return Array.isArray(data.items) ? data.items : null;
  } catch {
    return null;
  }
}

export default async function HomePage() {
  const covers = await getHomeCovers();
  return (
    <Wrapper>
      <Header/>
      <HomeHeroSlider covers={covers} />
      <ElectronicCategory/>
      <FeatureArea/>
      <ProductArea/>
      <BannerArea/>
      <OfferProducts/>
      <ProductGadgetArea/>
      <ProductBanner/>
       <NewArrivals/>
      <ProductSmArea/>
      <BlogArea/>
      <InstagramArea/>
      <CtaArea/>
      <Footer/>
    </Wrapper>
  )
}
