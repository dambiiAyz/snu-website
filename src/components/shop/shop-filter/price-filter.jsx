'use client';
import InputRange from "@/ui/input-range";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "@/utils/format-currency";

const PriceFilter = ({ priceFilterValues,maxPrice }) => {
  const { t } = useTranslation("common");
  const { priceValue,handleChanges } = priceFilterValues;
  const router = useRouter();

  const handlePriceFilter = () => {
    router.push(`/shop?minPrice=${priceValue[0]}&maxPrice=${priceValue[1]}`);
  };
  return (
    <>
      <div className="tp-shop-widget mb-35">
        <h3 className="tp-shop-widget-title no-border">{t("shop.priceFilter.title")}</h3>

        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-filter">
            <div id="slider-range" className="mb-10">
                <InputRange
                  STEP={1}
                  MIN={0}
                  MAX={maxPrice}
                  values={priceValue}
                  handleChanges={handleChanges}
                />
            </div>
            <div className="tp-shop-widget-filter-info d-flex align-items-center justify-content-between">
              <span className="input-range">
                {formatCurrency(priceValue[0])} - {formatCurrency(priceValue[1])}
              </span>
              <button onClick={handlePriceFilter} className="tp-shop-widget-filter-btn" type="button">
                {t("shop.priceFilter.button")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
