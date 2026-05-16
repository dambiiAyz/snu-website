'use client';
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";

const StatusFilter = ({setCurrPage,shop_right=false}) => {
  const { t } = useTranslation("common");
  const router = useRouter();
  const dispatch = useDispatch();
  const status = [
    { key: "on-sale", labelKey: "shop.status.onSale" },
    { key: "in-stock", labelKey: "shop.status.inStock" },
  ];
  const searchParams = useSearchParams();
  const router_status = searchParams.get('status');

  // handle status route 
  const handleStatusRoute = (statusKey) => {
    setCurrPage(1)
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?status=${statusKey}`
        )
      dispatch(handleFilterSidebarClose())
  }
  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">{t("shop.status.title")}</h3>
      <div className="tp-shop-widget-content">
        <div className="tp-shop-widget-checkbox">
          <ul className="filter-items filter-checkbox">
            {status.map((s) => (
              <li key={s.key} className="filter-item checkbox">
                <input
                  id={s.key}
                  type="checkbox"
                  checked={
                    router_status === s.key
                      ? "checked"
                      : false
                  }
                  readOnly
                />
                <label
                  onClick={() => handleStatusRoute(s.key)}
                  htmlFor={s.key}
                >
                  {t(s.labelKey)}
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
