'use client';
import { useState } from "react";
// internal
import { Search } from "@/svg";
import NiceSelect from "@/ui/nice-select";
import useSearchFormSubmit from "@/hooks/use-search-form-submit";
import { useTranslation } from "react-i18next";

const HeaderSearchForm = () => {
  const { t } = useTranslation("common");
  const { setSearchText, setCategory, handleSubmit, searchText } = useSearchFormSubmit();

  // selectHandle
  const selectCategoryHandle = (e) => {
    setCategory(e.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="tp-header-search-wrapper d-flex align-items-center">
        <div className="tp-header-search-box">
          <input
            onChange={(e) => setSearchText(e.target.value)}
            value={searchText}
            type="text"
            placeholder={t("header.searchPlaceholder")}
          />
        </div>
        <div className="tp-header-search-category">
          <NiceSelect
            options={[
              { value: "", text: t("header.selectCategory") },
              { value: "electronics", text: t("header.categories.electronics") },
              { value: "fashion", text: t("header.categories.fashion") },
              { value: "beauty", text: t("header.categories.beauty") },
              { value: "jewelry", text: t("header.categories.jewelry") },
            ]}
            defaultCurrent={0}
            onChange={selectCategoryHandle}
            name={t("header.selectCategory")}
          />
        </div>
        <div className="tp-header-search-btn">
          <button type="submit">
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
};

export default HeaderSearchForm;
