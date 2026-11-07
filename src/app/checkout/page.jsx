import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CheckoutArea from "@/components/checkout/checkout-area";

export const metadata = {
  title: "snu - Checkout Page",
};

export default function CheckoutPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <CheckoutArea/>
      <Footer style_2={true} />
    </Wrapper>
  );
}
