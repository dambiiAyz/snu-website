import { useRouter } from "next/navigation";
import React from "react";
import { useTranslation } from "react-i18next";

const ResetButton = ({ shop_right = false,setPriceValues,maxPrice }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const handleReset = () => {
    setPriceValues([0, maxPrice]);
    router.push(`/${shop_right ? "shop-right-sidebar" : "shop"}`);
  };
  return (
    <div className="tp-shop-widget mb-50">
      <h3 className="tp-shop-widget-title">{t("shop.reset.title")}</h3>
      <button
        onClick={handleReset}
        className="tp-btn"
      >
        {t("shop.reset.button")}
      </button>
    </div>
  );
};

export default ResetButton;
