'use client';
import React from "react";
import { useTranslation } from "react-i18next";

const ContactBreadcrumb = () => {
  const { t } = useTranslation("common");
  return (
    <section className="breadcrumb__area include-bg text-center pt-95 pb-50">
      <div className="container">
        <div className="row">
          <div className="col-xxl-12">
            <div className="breadcrumb__content p-relative z-index-1">
              <h3 className="breadcrumb__title">{t("contact.breadcrumbTitle")}</h3>
              <div className="breadcrumb__list">
                <span>
                  <a href="#">{t("breadcrumb.home")}</a>
                </span>
                <span>{t("breadcrumb.contact")}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactBreadcrumb;
