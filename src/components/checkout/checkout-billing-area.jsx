'use client';
import React from "react";
import ErrorMsg from "../common/error-msg";
import { useTranslation } from "react-i18next";

const CheckoutBillingArea = ({ register, errors }) => {
  const { t } = useTranslation("common");

  return (
    <div className="tp-checkout-bill-area">
      <h3 className="tp-checkout-bill-title">{t("checkout.billing.title")}</h3>

      <div className="tp-checkout-bill-form">
        <div className="tp-checkout-bill-inner">
          <div className="row">
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label htmlFor="firstName">
                  {t("checkout.billing.firstName")} <span>*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: t("checkout.billing.errors.firstName"),
                  })}
                  name="firstName"
                  id="firstName"
                  autoComplete="given-name"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.firstName")}
                />
                <ErrorMsg msg={errors?.firstName?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label htmlFor="lastName">
                  {t("checkout.billing.lastName")} <span>*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: t("checkout.billing.errors.lastName"),
                  })}
                  name="lastName"
                  id="lastName"
                  autoComplete="family-name"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.lastName")}
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label htmlFor="country">
                  {t("checkout.billing.country")} <span>*</span>
                </label>
                <input
                  {...register("country", { required: t("checkout.billing.errors.country") })}
                  name="country"
                  id="country"
                  autoComplete="country-name"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.country")}
                />
                <ErrorMsg msg={errors?.country?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label htmlFor="address">{t("checkout.billing.address")}</label>
                <input
                  {...register("address", { required: t("checkout.billing.errors.address") })}
                  name="address"
                  id="address"
                  autoComplete="street-address"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.address")}
                />
                <ErrorMsg msg={errors?.address?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label htmlFor="city">{t("checkout.billing.city")}</label>
                <input
                  {...register("city", { required: t("checkout.billing.errors.city") })}
                  name="city"
                  id="city"
                  autoComplete="address-level2"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.city")}
                />
                 <ErrorMsg msg={errors?.city?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label htmlFor="zipCode">{t("checkout.billing.zip")}</label>
                <input
                  {...register("zipCode", { required: t("checkout.billing.errors.zip") })}
                  name="zipCode"
                  id="zipCode"
                  autoComplete="postal-code"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.zip")}
                />
                <ErrorMsg msg={errors?.zipCode?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label htmlFor="contactNo">
                  {t("checkout.billing.phone")} <span>*</span>
                </label>
                <input
                  {...register("contactNo", {
                    required: t("checkout.billing.errors.phone"),
                  })}
                  name="contactNo"
                  id="contactNo"
                  autoComplete="tel"
                  type="tel"
                  placeholder={t("checkout.billing.placeholders.phone")}
                />
                <ErrorMsg msg={errors?.contactNo?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label htmlFor="email">
                  {t("checkout.billing.email")} <span>*</span>
                </label>
                <input
                  {...register("email", { required: t("checkout.billing.errors.email") })}
                  name="email"
                  id="email"
                  autoComplete="email"
                  type="email"
                  placeholder={t("checkout.billing.placeholders.email")}
                />
                <ErrorMsg msg={errors?.email?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label htmlFor="orderNote">{t("checkout.billing.orderNotes")}</label>
                <textarea
                  {...register("orderNote", { required: false })}
                  name="orderNote"
                  id="orderNote"
                  autoComplete="off"
                  placeholder={t("checkout.billing.placeholders.orderNotes")}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutBillingArea;
