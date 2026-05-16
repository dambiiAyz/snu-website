'use client'
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
// internal
import ErrorMsg from "../common/error-msg";
import { notifySuccess } from "@/utils/toast";

const ContactForm = () => {
  const { t } = useTranslation("common");
  const schema = useMemo(() => Yup.object().shape({
    name: Yup.string().required().label(t("contact.form.labels.name")),
    email: Yup.string().required().email().label(t("contact.form.labels.email")),
    subject: Yup.string().required().label(t("contact.form.labels.subject")),
    message: Yup.string().required().label(t("contact.form.labels.message")),
    remember: Yup.bool()
      .oneOf([true], t("contact.form.errors.remember"))
      .label(t("contact.form.labels.remember")),
  }), [t]);

    // react hook form
    const {register,handleSubmit,formState: { errors },reset} = useForm({
      resolver: yupResolver(schema),
    });
    // on submit
    const onSubmit = (data) => {
      if(data){
        notifySuccess(t("contact.form.success"));
      }

      reset();
    };

  return (
    <form onSubmit={handleSubmit(onSubmit)} id="contact-form">
      <div className="tp-contact-input-wrapper">
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("name", { required: t("contact.form.errors.name") })} name="name" id="name" type="text" placeholder={t("contact.form.placeholders.name")} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="name">{t("contact.form.labels.name")}</label>
          </div>
          <ErrorMsg msg={errors.name?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("email", { required: t("contact.form.errors.email") })} name="email" id="email" type="email" placeholder={t("contact.form.placeholders.email")} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="email">{t("contact.form.labels.email")}</label>
          </div>
          <ErrorMsg msg={errors.email?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <input {...register("subject", { required: t("contact.form.errors.subject") })} name="subject" id="subject" type="text" placeholder={t("contact.form.placeholders.subject")} />
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="subject">{t("contact.form.labels.subject")}</label>
          </div>
          <ErrorMsg msg={errors.subject?.message} />
        </div>
        <div className="tp-contact-input-box">
          <div className="tp-contact-input">
            <textarea {...register("message", { required: t("contact.form.errors.message") })} id="message" name="message" placeholder={t("contact.form.placeholders.message")}/>
          </div>
          <div className="tp-contact-input-title">
            <label htmlFor="message">{t("contact.form.labels.message")}</label>
          </div>
          <ErrorMsg msg={errors.message?.message} />
        </div>
      </div>
      <div className="tp-contact-suggetions mb-20">
        <div className="tp-contact-remeber">
          <input  {...register("remember", {required: t("contact.form.errors.remember")})} name="remember" id="remember" type="checkbox" />
          <label htmlFor="remember">{t("contact.form.rememberText")}</label>
          <ErrorMsg msg={errors.remember?.message} />
        </div>
      </div>
      <div className="tp-contact-btn">
        <button type="submit">{t("contact.form.submit")}</button>
      </div>
    </form>
  );
};

export default ContactForm;