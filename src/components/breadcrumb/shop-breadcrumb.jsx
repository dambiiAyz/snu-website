'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';

const ShopBreadcrumb = ({ title, subtitle, titleKey, subtitleKey }) => {
  const { t } = useTranslation('common');
  const resolvedTitle = titleKey ? t(titleKey) : title;
  const resolvedSubtitle = subtitleKey ? t(subtitleKey) : subtitle;
  return (
    <>
      <section className="breadcrumb__area include-bg pt-100 pb-50">
        <div className="container">
          <div className="row">
            <div className="col-xxl-12">
              <div className="breadcrumb__content p-relative z-index-1">
                <h3 className="breadcrumb__title">{resolvedTitle}</h3>
                <div className="breadcrumb__list">
                  <span><a href="#">{t('breadcrumb.home')}</a></span>
                  <span>{resolvedSubtitle}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default ShopBreadcrumb;