'use client';
import { useState } from "react";
import { useTranslation } from "react-i18next";
import LoginForm from "../forms/login-form";

const CheckoutLogin = () => {
  const { t } = useTranslation("common");
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="tp-checkout-verify-item">
      <p className="tp-checkout-verify-reveal">
        {t("checkout.login.returningCustomer")}{" "}
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="tp-checkout-login-form-reveal-btn"
        >
          {t("checkout.login.clickHere")}
        </button>
      </p>

      {isOpen && (
        <div id="tpReturnCustomerLoginForm" className="tp-return-customer">
          <LoginForm />
        </div>
      )}
    </div>
  );
};

export default CheckoutLogin;
