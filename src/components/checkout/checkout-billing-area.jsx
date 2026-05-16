'use client';
import React from "react";
import ErrorMsg from "../common/error-msg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const CheckoutBillingArea = ({ register, errors }) => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="tp-checkout-bill-area">
      <h3 className="tp-checkout-bill-title">{t("checkout.billing.title")}</h3>

      <div className="tp-checkout-bill-form">
        <div className="tp-checkout-bill-inner">
          <div className="row">
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  {t("checkout.billing.firstName")} <span>*</span>
                </label>
                <input
                  {...register("firstName", {
                    required: t("checkout.billing.errors.firstName"),
                  })}
                  name="firstName"
                  id="firstName"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.firstName")}
                  defaultValue={user?.firstName}
                />
                <ErrorMsg msg={errors?.firstName?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>
                  {t("checkout.billing.lastName")} <span>*</span>
                </label>
                <input
                  {...register("lastName", {
                    required: t("checkout.billing.errors.lastName"),
                  })}
                  name="lastName"
                  id="lastName"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.lastName")}
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  {t("checkout.billing.country")} <span>*</span>
                </label>
                <input
                  {...register("country", { required: t("checkout.billing.errors.country") })}
                  name="country"
                  id="country"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.country")}
                />
                <ErrorMsg msg={errors?.lastName?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>{t("checkout.billing.address")}</label>
                <input
                  {...register("address", { required: t("checkout.billing.errors.address") })}
                  name="address"
                  id="address"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.address")}
                />
                <ErrorMsg msg={errors?.address?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>{t("checkout.billing.city")}</label>
                <input
                  {...register("city", { required: t("checkout.billing.errors.city") })}
                  name="city"
                  id="city"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.city")}
                />
                 <ErrorMsg msg={errors?.city?.message} />
              </div>
            </div>
            <div className="col-md-6">
              <div className="tp-checkout-input">
                <label>{t("checkout.billing.zip")}</label>
                <input
                  {...register("zipCode", { required: t("checkout.billing.errors.zip") })}
                  name="zipCode"
                  id="zipCode"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.zip")}
                />
                <ErrorMsg msg={errors?.zipCode?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  {t("checkout.billing.phone")} <span>*</span>
                </label>
                <input
                  {...register("contactNo", {
                    required: t("checkout.billing.errors.phone"),
                  })}
                  name="contactNo"
                  id="contactNo"
                  type="text"
                  placeholder={t("checkout.billing.placeholders.phone")}
                />
                <ErrorMsg msg={errors?.contactNo?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>
                  {t("checkout.billing.email")} <span>*</span>
                </label>
                <input
                  {...register("email", { required: t("checkout.billing.errors.email") })}
                  name="email"
                  id="email"
                  type="email"
                  placeholder={t("checkout.billing.placeholders.email")}
                  defaultValue={user?.email}
                />
                <ErrorMsg msg={errors?.email?.message} />
              </div>
            </div>
            <div className="col-md-12">
              <div className="tp-checkout-input">
                <label>{t("checkout.billing.orderNotes")}</label>
                <textarea
                  {...register("orderNote", { required: false })}
                  name="orderNote"
                  id="orderNote"
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
