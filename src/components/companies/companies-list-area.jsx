'use client';

import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { useGetPublicCompaniesQuery } from "@/redux/features/companyApi";
import { normalizeCompanyListResponse } from "@/redux/features/companyApi";
import Loader from "@/components/loader/loader";
import ErrorMsg from "@/components/common/error-msg";

const CompaniesListArea = () => {
  const { t } = useTranslation("common");
  const [q, setQ] = useState("");
  const { data, isLoading, isError, error } = useGetPublicCompaniesQuery();

  const companies = useMemo(
    () => normalizeCompanyListResponse(data),
    [data]
  );

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return companies;
    return companies.filter((c) => {
      const name = (c.name || "").toLowerCase();
      const slug = (c.slug || "").toLowerCase();
      const email = (c.email || "").toLowerCase();
      return name.includes(needle) || slug.includes(needle) || email.includes(needle);
    });
  }, [companies, q]);

  useEffect(() => {
    document.title = t("companies.list.documentTitle");
  }, [t]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <Loader loading={true} />
      </div>
    );
  }

  if (isError) {
    const msg =
      error?.data?.error ||
      error?.data?.message ||
      t("companies.list.apiUnavailable");
    return (
      <section className="pb-120 pt-40">
        <div className="container">
          <ErrorMsg msg={msg} />
          <p className="mt-20 text-center">
            <Link href="/shop" className="tp-btn tp-btn-border">
              {t("companies.list.goToShop")}
            </Link>
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="pb-120 pt-40">
      <div className="container">
        <div className="row mb-40">
          <div className="col-xl-8 col-lg-8 mx-auto">
            <input
              type="search"
              className="form-control"
              placeholder={t("companies.list.searchPlaceholder")}
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-5">
            <p className="mb-20">{t("companies.list.empty")}</p>
            <Link href="/shop" className="tp-btn">
              {t("companies.list.goToShop")}
            </Link>
          </div>
        ) : (
          <div className="row g-4">
            {filtered.map((c) => {
              const slug = c.slug || c._id;
              if (!slug) return null;
              return (
                <div key={String(slug)} className="col-xl-4 col-md-6">
                  <Link
                    href={`/companies/${encodeURIComponent(String(slug))}`}
                    className="d-block border rounded-3 p-30 h-100 text-decoration-none tp-product-item-2"
                  >
                    <div className="d-flex align-items-center gap-3 mb-15">
                      {c.logoUrl ? (
                        <Image
                          src={c.logoUrl}
                          alt=""
                          width={56}
                          height={56}
                          className="rounded-2 object-fit-contain"
                          unoptimized
                        />
                      ) : (
                        <div
                          className="rounded-2 bg-light d-flex align-items-center justify-content-center text-uppercase fw-bold"
                          style={{ width: 56, height: 56 }}
                        >
                          {(c.name || "?").slice(0, 1)}
                        </div>
                      )}
                      <div>
                        <h4 className="h5 mb-0 text-black">{c.name}</h4>
                        <span className="small text-muted">{c.slug}</span>
                      </div>
                    </div>
                    {c.legalName ? (
                      <p className="small text-muted mb-0">{c.legalName}</p>
                    ) : null}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CompaniesListArea;
