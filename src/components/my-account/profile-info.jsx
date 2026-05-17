'use client';

import React, { useMemo } from 'react';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
// internal
import ErrorMsg from '../common/error-msg';
import { EmailTwo, LocationTwo, PhoneThree, UserThree } from '@/svg';
import { useUpdateProfileMutation } from '@/redux/features/auth/authApi';
import { notifyError, notifySuccess } from '@/utils/toast';

const ProfileInfo = () => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state) => state.auth);

  const schema = useMemo(
    () =>
      Yup.object().shape({
        name: Yup.string().required(t("profile.information.validation.nameRequired")),
        email: Yup.string()
          .required(t("profile.information.validation.emailRequired"))
          .email(t("profile.information.validation.emailInvalid")),
        phone: Yup.string()
          .required(t("profile.information.validation.phoneRequired"))
          .min(11, t("profile.information.validation.phoneMin")),
        address: Yup.string().required(t("profile.information.validation.addressRequired")),
        bio: Yup.string()
          .required(t("profile.information.validation.bioRequired"))
          .min(20, t("profile.information.validation.bioMin")),
      }),
    [t]
  );

  const resolver = useMemo(() => yupResolver(schema), [schema]);

  const [updateProfile, {}] = useUpdateProfileMutation();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver,
  });

  const onSubmit = (data) => {
    updateProfile({
      id: user?._id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
      bio: data.bio,
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
    <div className="profile__info">
      <h3 className="profile__info-title">{t("profile.information.title")}</h3>
      <div className="profile__info-content">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("name")}
                    name="name"
                    type="text"
                    placeholder={t("profile.information.placeholders.name")}
                    defaultValue={user?.name}
                  />
                  <span>
                    <UserThree />
                  </span>
                  <ErrorMsg msg={errors.name?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-6 col-md-6">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("email")}
                    name="email"
                    type="email"
                    placeholder={t("profile.information.placeholders.email")}
                    defaultValue={user?.email}
                  />
                  <span>
                    <EmailTwo />
                  </span>
                  <ErrorMsg msg={errors.email?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("phone")}
                    name="phone"
                    type="text"
                    placeholder={t("profile.information.placeholders.phone")}
                    defaultValue={user?.phone ?? ""}
                  />
                  <span>
                    <PhoneThree />
                  </span>
                  <ErrorMsg msg={errors.phone?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <input
                    {...register("address")}
                    name="address"
                    type="text"
                    placeholder={t("profile.information.placeholders.address")}
                    defaultValue={user?.address ?? ""}
                  />
                  <span>
                    <LocationTwo />
                  </span>
                  <ErrorMsg msg={errors.address?.message} />
                </div>
              </div>
            </div>

            <div className="col-xxl-12">
              <div className="profile__input-box">
                <div className="profile__input">
                  <textarea
                    {...register("bio")}
                    name="bio"
                    placeholder={t("profile.information.placeholders.bio")}
                    defaultValue={user?.bio ?? ""}
                  />
                  <ErrorMsg msg={errors.bio?.message} />
                </div>
              </div>
            </div>
            <div className="col-xxl-12">
              <div className="profile__btn">
                <button type="submit" className="tp-btn">{t("profile.information.submit")}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileInfo;
