"use client";
import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import payment_option_img from "@assets/img/product/icons/payment-option.png";

const DetailsBottomInfo = ({ sku, category, tag }) => {
  const { t } = useTranslation("common");
  return (
    <>
      {/* product-details-query */}
      <div className="tp-product-details-query">
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>{t("productDetails.info.sku")}: </span>
          <p>{sku}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>{t("productDetails.info.category")}: </span>
          <p>{category}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>{t("productDetails.info.tag")}: </span>
          <p>{tag}</p>
        </div>
      </div>

      {/*  product-details-social*/}

      <div className="tp-product-details-social">
        <span>{t("productDetails.info.share")}: </span>
        <a href="#">
          <i className="fa-brands fa-facebook-f"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-twitter"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-linkedin-in"></i>
        </a>
        <a href="#">
          <i className="fa-brands fa-vimeo-v"></i>
        </a>
      </div>

      {/* product-details-msg */}

      <div className="tp-product-details-msg mb-15">
        <ul>
          <li>{t("productDetails.info.returns")}</li>
          <li>{t("productDetails.info.dispatch")}</li>
        </ul>
      </div>
      {/* product-details-payment */}
      {/* <div className="tp-product-details-payment d-flex align-items-center flex-wrap justify-content-between">
        <p>
          {t("productDetails.info.safeCheckoutLine1")} <br /> {t("productDetails.info.safeCheckoutLine2")}
        </p>
        <Image src={payment_option_img} alt="payment_option_img" />
      </div> */}
    </>
  );
};

export default DetailsBottomInfo;
