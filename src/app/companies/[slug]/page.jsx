import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CompanyDetailArea from "@/components/companies/company-detail-area";

export const metadata = {
  title: "snu - Company",
};

export default async function CompanyPage({ params }) {
  const { slug } = await params;
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <CompanyDetailArea slug={slug} />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
