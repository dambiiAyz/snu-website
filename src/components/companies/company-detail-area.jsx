'use client';

import React, { useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import {
  useGetPublicCompanyBySlugQuery,
  useGetPublicCompaniesQuery,
  normalizeCompanyListResponse,
  normalizeCompanyDetailResponse,
} from "@/redux/features/companyApi";
import { useGetAllProductsQuery } from "@/redux/features/productApi";
import { filterProductsByCompanySlug } from "@/utils/companyProduct";
import ProductItem from "@/components/products/fashion/product-item";
import Loader from "@/components/loader/loader";
import ErrorMsg from "@/components/common/error-msg";

const CompanyDetailArea = ({ slug }) => {
  const { t } = useTranslation("common");
  const safeSlug = decodeURIComponent(String(slug || "")).trim();

  const {
    data: companyRes,
    isLoading: coLoading,
    isError: coError,
    error: coErr,
  } = useGetPublicCompanyBySlugQuery(safeSlug, { skip: !safeSlug });

  const { data: listRes } = useGetPublicCompaniesQuery(undefined, {
    skip: !coError,
  });

  const {
    data: productsRes,
    isLoading: prLoading,
    isError: prIsError,
  } = useGetAllProductsQuery(
    safeSlug ? { companySlug: safeSlug } : undefined,
    { skip: !safeSlug }
  );

  const companyFromApi = useMemo(
    () => normalizeCompanyDetailResponse(companyRes),
    [companyRes]
  );

  const fallbackFromList = useMemo(() => {
    const list = normalizeCompanyListResponse(listRes);
    return list.find(
      (c) =>
        String(c.slug || "").toLowerCase() === safeSlug.toLowerCase() ||
        String(c._id || "") === safeSlug
    );
  }, [listRes, safeSlug]);

  const company = companyFromApi || fallbackFromList || null;

  const products = useMemo(() => {
    const rawProducts = productsRes?.data || [];
    return filterProductsByCompanySlug(rawProducts, safeSlug);
  }, [productsRes, safeSlug]);

  useEffect(() => {
    if (company?.name) {
      document.title = t("companies.detail.documentTitle", {
        name: company.name,
      });
    }
  }, [company?.name, t]);

  if (!safeSlug) {
    return (
      <div className="container py-5">
        <ErrorMsg msg={t("companies.detail.invalidSlug")} />
      </div>
    );
  }

  if (coLoading && !company) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Loader loading={true} />
      </div>
    );
  }

  if (coError && !company) {
    const msg =
      coErr?.data?.error ||
      coErr?.data?.message ||
      t("companies.detail.notFound");
    return (
      <div className="container py-5">
        <ErrorMsg msg={msg} />
        <p className="mt-20 text-center">
          <Link href="/companies" className="tp-btn tp-btn-border me-10">
            {t("companies.detail.backToList")}
          </Link>
          <Link href="/shop" className="tp-btn">
            {t("companies.list.goToShop")}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <section className="pb-120 pt-40">
      <div className="container">
        <nav className="breadcrumb__list small mb-25" aria-label="Breadcrumb">
          <Link href="/">{t("breadcrumb.home")}</Link>
          <span className="mx-5">/</span>
          <Link href="/companies">{t("companies.list.title")}</Link>
          <span className="mx-5">/</span>
          <span>{company?.name || safeSlug}</span>
        </nav>
        <div className="row mb-40 align-items-center">
          <div className="col-lg-8">
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {company?.logoUrl ? (
                <Image
                  src={company.logoUrl}
                  alt=""
                  width={72}
                  height={72}
                  className="rounded-3 object-fit-contain border p-5"
                  unoptimized
                />
              ) : (
                <div
                  className="rounded-3 bg-light d-flex align-items-center justify-content-center fw-bold fs-3"
                  style={{ width: 72, height: 72 }}
                >
                  {(company?.name || "?").slice(0, 1)}
                </div>
              )}
              <div>
                <h1 className="h2 mb-5">{company?.name || safeSlug}</h1>
                {company?.legalName ? (
                  <p className="text-muted mb-0">{company.legalName}</p>
                ) : null}
              </div>
            </div>
          </div>
          <div className="col-lg-4 text-lg-end mt-20 mt-lg-0">
            <Link
              href={`/shop?company=${encodeURIComponent(safeSlug)}`}
              className="tp-btn tp-btn-border"
            >
              {t("companies.detail.shopFiltered")}
            </Link>
          </div>
        </div>

        <h2 className="h4 mb-25">{t("companies.detail.productsHeading")}</h2>

        {prLoading ? (
          <Loader loading={true} />
        ) : prIsError ? (
          <ErrorMsg msg={t("errors.generic")} />
        ) : products.length === 0 ? (
          <p className="text-muted">{t("companies.detail.noProducts")}</p>
        ) : (
          <div className="row g-4">
            {products.map((item) => (
              <div key={item._id} className="col-xl-4 col-md-6 col-sm-6">
                <ProductItem product={item} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompanyDetailArea;
