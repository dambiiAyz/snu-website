'use client';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useGetProductTypeQuery } from "@/redux/features/productApi";
import { ShapeLine, TabLine } from "@/svg";
import ProductItem from "./product-item";
import ErrorMsg from "@/components/common/error-msg";
import HomePrdLoader from "@/components/loader/home/home-prd-loader";

const tabs = [
  { key: "new", labelKey: "home.productArea.tabs.new" },
  { key: "featured", labelKey: "home.productArea.tabs.featured" },
  { key: "topSellers", labelKey: "home.productArea.tabs.topSellers" },
];

const ProductArea = () => {
  const [activeTab, setActiveTab] = useState("new");
  const { t } = useTranslation("common");
  const {data:products,isError,isLoading,refetch} = 
  useGetProductTypeQuery({type:'electronics',query:`${activeTab}=true`});
  // handleActiveTab
  const handleActiveTab = (tab) => {
    setActiveTab(tab);
  };
  // refetch when active value change
  useEffect(() => {
    refetch()
  },[activeTab,refetch])

  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomePrdLoader loading={isLoading}/>
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg={t("errors.generic")} />;
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg={t("errors.noProducts")} />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    const product_items = products.data;
    content = product_items.map((prd,i) => (
      <div key={i} className="col-xl-3 col-lg-3 col-sm-6">
        <ProductItem product={prd}/>  
    </div>
    ))
  }
  return (
    <section className="tp-product-area pb-55">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-xl-5 col-lg-6 col-md-5">
            <div className="tp-section-title-wrapper mb-40">
              <h3 className="tp-section-title">
                {t("home.productArea.trendingTitle")}
                <ShapeLine />
              </h3>
            </div>
          </div>
          <div className="col-xl-7 col-lg-6 col-md-7">
            <div className="tp-product-tab tp-product-tab-border mb-45 tp-tab d-flex justify-content-md-end">
              <ul className="nav nav-tabs justify-content-sm-end">
                {tabs.map((tab, i) => (
                  <li key={i} className="nav-item">
                    <button
                      onClick={() => handleActiveTab(tab.key)}
                      className={`nav-link text-capitalize ${
                        activeTab === tab.key ? "active" : ""
                      }`}
                    >
                      {t(tab.labelKey)}
                      <span className="tp-product-tab-line">
                        <TabLine />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    </section>
  );
};

export default ProductArea;
