"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import payment_option_img from "@assets/img/product/icons/payment-option.png";
import { notifyError, notifySuccess } from "@/utils/toast";

const DetailsBottomInfo = ({ productId, title, sku, category, tag }) => {
  const { t } = useTranslation("common");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(process.env.NEXT_PUBLIC_SITE_URL || window.location.origin);
  }, []);

  const shareUrl = origin && productId
    ? new URL(`/product-details/${encodeURIComponent(productId)}`, origin).href
    : "";
  const encodedUrl = encodeURIComponent(shareUrl);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      notifySuccess(t("productDetails.info.linkCopied"));
    } catch {
      notifyError(t("productDetails.info.copyFailed"));
    }
  };

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

      {shareUrl && <div className="tp-product-details-social">
        <span>{t("productDetails.info.share")}: </span>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
          <i className="fa-brands fa-facebook-f" aria-hidden="true"></i>
        </a>
        <a href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(title || "")}`} target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
          <i className="fa-brands fa-twitter" aria-hidden="true"></i>
        </a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <i className="fa-brands fa-linkedin-in" aria-hidden="true"></i>
        </a>
        <button type="button" onClick={copyLink} title={t("productDetails.info.copyLink")} aria-label={t("productDetails.info.copyLink")}>
          <i className="fa-solid fa-link" aria-hidden="true"></i>
        </button>
      </div>}

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
