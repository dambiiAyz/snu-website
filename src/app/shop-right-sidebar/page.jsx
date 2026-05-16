import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import ShopBreadcrumb from "@/components/breadcrumb/shop-breadcrumb";
import ShopArea from "@/components/shop/shop-area";

export const metadata = {
  title: "snu - Shop Right Sidebar Page",
};

export default function ShopRightSidebarPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <ShopBreadcrumb titleKey="breadcrumb.shopGrid" subtitleKey="breadcrumb.shopGrid" />
      <ShopArea shop_right={true}/>
      <Footer primary_style={true} />
    </Wrapper>
  );
}
