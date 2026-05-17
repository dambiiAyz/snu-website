'use client';

import React, { useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  useGetPublicCompaniesQuery,
  normalizeCompanyListResponse,
} from "@/redux/features/companyApi";
import { setStoredShopCompanySlug } from "@/utils/companyStorage";

const ShopCompanyFilter = ({ activeSlug }) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname() || "/shop";
  const searchParams = useSearchParams();
  const { data, isLoading, isError } = useGetPublicCompaniesQuery(undefined, {
    refetchOnMountOrArgChange: false,
  });

  const companies = useMemo(
    () => normalizeCompanyListResponse(data),
    [data]
  );

  const value = activeSlug?.trim() || "";

  const buildUrl = (nextCompany) => {
    const p = new URLSearchParams(searchParams.toString());
    if (nextCompany) p.set("company", nextCompany);
    else p.delete("company");
    const qs = p.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  };

  const onChange = (e) => {
    const next = e.target.value;
    if (!next) {
      setStoredShopCompanySlug("");
      router.push(buildUrl(""));
      return;
    }
    setStoredShopCompanySlug(next);
    router.push(buildUrl(next));
  };

  if (isLoading || isError || companies.length === 0) {
    return null;
  }

  return (
    <div className="tp-shop-company-filter mb-20 p-20 grey-bg-2 rounded-3">
      <label className="form-label fw-semibold mb-8 d-block" htmlFor="shop-company-select">
        {t("companies.shopFilter.label")}
      </label>
      <select
        id="shop-company-select"
        className="form-select"
        value={value}
        onChange={onChange}
      >
        <option value="">{t("companies.shopFilter.all")}</option>
        {companies.map((c) => {
          const slug = c.slug || c._id;
          if (!slug) return null;
          return (
            <option key={String(slug)} value={String(slug)}>
              {c.name || slug}
            </option>
          );
        })}
      </select>
      <p className="small text-muted mb-0 mt-8">{t("companies.shopFilter.hint")}</p>
    </div>
  );
};

export default ShopCompanyFilter;
