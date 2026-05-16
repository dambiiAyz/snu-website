'use client';
import { useState } from "react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CheckoutCoupon = ({ handleCouponCode, couponRef,couponApplyMsg }) => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  const { coupon_info } = useSelector((state) => state.coupon);
  return (
    <div className="tp-checkout-verify-item">
      <p className="tp-checkout-verify-reveal">
        {t("checkout.coupon.haveCoupon")}{" "}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="tp-checkout-coupon-form-reveal-btn"
        >
          {t("checkout.coupon.clickHere")}
        </button>
      </p>

      {isOpen && (
        <div id="tpCheckoutCouponForm" className="tp-return-customer">
          <form onSubmit={handleCouponCode}>
            <div className="tp-return-customer-input">
              <label>{t("checkout.coupon.codeLabel")}</label>
              <input ref={couponRef} type="text" placeholder={t("checkout.coupon.placeholder")} />
            </div>
            <button
              type="submit"
              className="tp-return-customer-btn tp-checkout-btn"
            >
              {t("checkout.coupon.apply")}
            </button>
          </form>
          {couponApplyMsg && <p className="p-2" style={{color:'green'}}>{couponApplyMsg}</p>}
        </div>
      )}
    </div>
  );
};

export default CheckoutCoupon;
