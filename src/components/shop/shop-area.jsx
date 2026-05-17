'use client'
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import ShopLoader from "../loader/shop/shop-loader";
import ErrorMsg from "../common/error-msg";
import ShopFilterOffCanvas from "../common/shop-filter-offcanvas";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import ShopContent from "./shop-content";
import ShopCompanyFilter from "./shop-company-filter";
import { getStoredShopCompanySlug, setStoredShopCompanySlug } from "@/utils/companyStorage";
import { filterProductsByCompanySlug } from "@/utils/companyProduct";

const ShopArea = ({ shop_right = false, hidden_sidebar = false }) => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname() || "/shop";
  const category = searchParams.get('category');
  const brand = searchParams.get('brand');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const subCategory = searchParams.get('subCategory');
  const filterColor = searchParams.get('color');
  const status = searchParams.get('status');
  const companyFromUrl = searchParams.get("company")?.trim() || "";

  const productQueryArg = useMemo(
    () => (companyFromUrl ? { companySlug: companyFromUrl } : undefined),
    [companyFromUrl]
  );

  const { data: products, isError, isLoading } = useGetAllProductsQuery(productQueryArg);

  const [priceValue, setPriceValue] = useState([0, 0]);
  const [selectValue, setSelectValue] = useState("default");
  const [currPage, setCurrPage] = useState(1);

  useEffect(() => {
    if (companyFromUrl) setStoredShopCompanySlug(companyFromUrl);
  }, [companyFromUrl]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (companyFromUrl) return;
    const stored = getStoredShopCompanySlug();
    if (!stored) return;
    const p = new URLSearchParams(searchParams.toString());
    p.set("company", stored);
    router.replace(`${pathname}?${p.toString()}`);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- restore ?company= from localStorage once on mount
  }, []);

  useEffect(() => {
    if (!isLoading && !isError && products?.data?.length > 0) {
      const maxPriceVal = products.data.reduce((max, product) => {
        return product.price > max ? product.price : max;
      }, 0);
      setPriceValue([0, maxPriceVal]);
    }
  }, [isLoading, isError, products]);

  const handleChanges = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };

  const selectHandleFilter = (e) => {
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: {
      priceValue,
      handleChanges,
      setPriceValue,
    },
    selectHandleFilter,
    currPage,
    setCurrPage,
  };

  let content = null;

  if (isLoading) {
    content = <ShopLoader loading={isLoading} />;
  }
  if (!isLoading && isError) {
    content = (
      <div className="pb-80 text-center">
        <ErrorMsg msg={t("errors.generic")} />
      </div>
    );
  }
  if (!isLoading && !isError && products?.data?.length === 0) {
    content = <ErrorMsg msg={t("errors.noProducts")} />;
  }
  if (!isLoading && !isError && products?.data?.length > 0) {
    let product_items = products.data;

    if (selectValue) {
      if (selectValue === "default") {
        product_items = products.data;
      } else if (selectValue === "lowToHigh") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(a.price) - Number(b.price));
      } else if (selectValue === "highToLow") {
        product_items = products.data
          .slice()
          .sort((a, b) => Number(b.price) - Number(a.price));
      } else if (selectValue === "newAdded") {
        product_items = products.data
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (selectValue === "onSale") {
        product_items = products.data.filter((p) => p.discount > 0);
      } else {
        product_items = products.data;
      }
    }

    if (status) {
      if (status === "on-sale") {
        product_items = product_items.filter((p) => p.discount > 0);
      } else if (status === "in-stock") {
        product_items = product_items.filter((p) => p.status === "in-stock");
      }
    }

    if (category) {
      product_items = product_items.filter(
        (p) =>
          p.parent.toLowerCase().replace("&", "").split(" ").join("-") ===
          category
      );
    }

    if (subCategory) {
      product_items = product_items.filter(
        (p) =>
          p.children.toLowerCase().replace("&", "").split(" ").join("-") ===
          subCategory
      );
    }

    if (filterColor) {
      product_items = product_items.filter((product) => {
        for (let i = 0; i < product.imageURLs.length; i++) {
          const color = product.imageURLs[i]?.color;
          if (
            color &&
            color?.name.toLowerCase().split(" ").join("-") === filterColor
          ) {
            return true;
          }
        }
        return false;
      });
    }

    if (brand) {
      product_items = product_items.filter(
        (p) =>
          p.brand.name.toLowerCase().split(" ").join("-").replace("&", "") ===
          brand
      );
    }

    if (minPrice && maxPrice) {
      product_items = product_items.filter(
        (p) =>
          Number(p.price) >= Number(minPrice) &&
          Number(p.price) <= Number(maxPrice)
      );
    }

    if (companyFromUrl) {
      product_items = filterProductsByCompanySlug(product_items, companyFromUrl);
    }

    content = (
      <>
        <ShopCompanyFilter activeSlug={companyFromUrl} />
        <ShopContent
          all_products={products.data}
          products={product_items}
          otherProps={otherProps}
          shop_right={shop_right}
          hidden_sidebar={hidden_sidebar}
        />
        <ShopFilterOffCanvas
          all_products={products.data}
          otherProps={otherProps}
        />
      </>
    );
  }

  return (
    <>
      {content}
    </>
  );
};

export default ShopArea;
