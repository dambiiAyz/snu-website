'use client';

import React, { useMemo } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useChangePasswordMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const ChangePassword = () => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state) => state.auth);
  const [changePassword, {}] = useChangePasswordMutation();

  const schema = useMemo(
    () =>
      Yup.object().shape({
        password: Yup.string()
          .required(t("profile.password.validation.oldRequired"))
          .min(6, t("profile.password.validation.min", { min: 6 })),
        newPassword: Yup.string()
          .required(t("profile.password.validation.newRequired"))
          .min(6, t("profile.password.validation.min", { min: 6 })),
        confirmPassword: Yup.string()
          .required(t("profile.password.validation.confirmRequired"))
          .oneOf([Yup.ref("newPassword")], t("profile.password.validation.confirmMatch")),
      }),
    [t]
  );

  const schemaTwo = useMemo(
    () =>
      Yup.object().shape({
        newPassword: Yup.string()
          .required(t("profile.password.validation.newRequired"))
          .min(6, t("profile.password.validation.min", { min: 6 })),
        confirmPassword: Yup.string()
          .required(t("profile.password.validation.confirmRequired"))
          .oneOf([Yup.ref("newPassword")], t("profile.password.validation.confirmMatch")),
      }),
    [t]
  );

  const resolver = useMemo(
    () => yupResolver(user?.googleSignIn ? schemaTwo : schema),
    [user?.googleSignIn, schema, schemaTwo]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver,
  });

  const onSubmit = (data) => {
    changePassword({
      email: user?.email,
      password: data.password,
      newPassword: data.newPassword,
      googleSignIn: user?.googleSignIn,
    }).then((result) => {
      if (result?.error) {
        notifyError(result?.error?.data?.message);
      } else {
        notifySuccess(result?.data?.message);
      }
    });
    reset();
  };

  return (
    <div className="profile__password">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {!user?.googleSignIn && (
            <div className="col-xxl-12">
              <div className="tp-profile-input-box">
                <div className="tp-contact-input">
                  <input
                    {...register("password")}
                    name="password"
                    id="password"
                    type="password"
                  />
                </div>
                <div className="tp-profile-input-title">
                  <label htmlFor="password">{t("profile.password.labels.old")}</label>
                </div>
                <ErrorMsg msg={errors.password?.message} />
              </div>
            </div>
          )}
          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input">
                <input
                  {...register("newPassword")}
                  name="newPassword"
                  id="newPassword"
                  type="password"
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="newPassword">{t("profile.password.labels.new")}</label>
              </div>
              <ErrorMsg msg={errors.newPassword?.message} />
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="tp-profile-input-box">
              <div className="tp-profile-input">
                <input
                  {...register("confirmPassword")}
                  name="confirmPassword"
                  id="confirmPassword"
                  type="password"
                />
              </div>
              <div className="tp-profile-input-title">
                <label htmlFor="confirmPassword">{t("profile.password.labels.confirm")}</label>
              </div>
              <ErrorMsg msg={errors.confirmPassword?.message} />
            </div>
          </div>
          <div className="col-xxl-6 col-md-6">
            <div className="profile__btn">
              <button type="submit" className="tp-btn">
                {t("profile.password.submit")}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
