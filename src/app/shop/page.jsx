import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";
import ShopLoader from "@/components/loader/shop/shop-loader";
import { Suspense } from "react";

export const metadata = {
  title: "snu - Shop Page",
};

export default function ShopPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb titleKey="breadcrumb.shopGrid" subtitleKey="breadcrumb.shopGrid" />
      <Suspense fallback={<ShopLoader loading={true} />}>
        <ShopArea />
      </Suspense>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
