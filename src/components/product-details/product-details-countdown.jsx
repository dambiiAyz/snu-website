'use client';
import React from "react";
import Timer from "../common/timer";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";

const ProductDetailsCountdown = ({ offerExpiryTime }) => {
  const { t } = useTranslation("common");
  return (
    <div className="tp-product-details-countdown d-flex align-items-center justify-content-between flex-wrap mt-25 mb-25">
      <h4 className="tp-product-details-countdown-title">
        <i className="fa-solid fa-fire-flame-curved"></i> {t("productDetails.flashSale")}:{" "}
      </h4>
      <div
        className="tp-product-details-countdown-time"
      >
        {dayjs().isAfter(offerExpiryTime) ? (
          <ul>
            <li>
              <span>{0}</span> {t("product.timer.day")}
            </li>
            <li>
              <span>{0}</span> {t("product.timer.hours")}
            </li>
            <li>
              <span>{0}</span> {t("product.timer.minutes")}
            </li>
            <li>
              <span>{0}</span> {t("product.timer.seconds")}
            </li>
          </ul>
        ) : (
          <Timer expiryTimestamp={new Date(offerExpiryTime)} />
        )}
      </div>
    </div>
  );
};

export default ProductDetailsCountdown;
