import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import CompaniesListArea from "@/components/companies/companies-list-area";

export const metadata = {
  title: "snu - Companies",
};

export default function CompaniesPage() {
  return (
    <Wrapper>
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb
        titleKey="companies.list.title"
        subtitleKey="companies.list.subtitle"
        center={true}
      />
      <CompaniesListArea />
      <Footer primary_style={true} />
    </Wrapper>
  );
}
