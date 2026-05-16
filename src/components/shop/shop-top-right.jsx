import React from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
// internal
import { Filter } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import {handleFilterSidebarOpen } from "@/redux/features/shop-filter-slice";

const ShopTopRight = ({selectHandleFilter}) => {
  const dispatch = useDispatch()
  const { t } = useTranslation("common");
  return (
    <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
      <div className="tp-shop-top-select">
        <NiceSelect
          options={[
            { value: "default", text: t("shop.sort.default") },
            { value: "lowToHigh", text: t("shop.sort.lowToHigh") },
            { value: "highToLow", text: t("shop.sort.highToLow") },
            { value: "newAdded", text: t("shop.sort.newAdded") },
            { value: "onSale", text: t("shop.sort.onSale") },
          ]}
          defaultCurrent={0}
          onChange={selectHandleFilter}
          name="sort"
        />
      </div>
      <div className="tp-shop-top-filter">
        <button onClick={()=> dispatch(handleFilterSidebarOpen())} type="button" className="tp-filter-btn">
          <span>
            <Filter />
          </span>
          {" "}{t("shop.filterButton")}
        </button>
      </div>
    </div>
  );
};

export default ShopTopRight;
