'use client';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Delivery, Discount, Refund, Support } from '@/svg';

export const feature_data = [
  {
    icon: <Delivery />,
    titleKey: 'home.features.deliveryTitle',
    subtitleKey: 'home.features.deliverySubtitle'
  },
  {
    icon: <Refund />,
    titleKey: 'home.features.refundTitle',
    subtitleKey: 'home.features.refundSubtitle'
  },
  {
    icon: <Discount />,
    titleKey: 'home.features.discountTitle',
    subtitleKey: 'home.features.discountSubtitle'
  },
  {
    icon: <Support />,
    titleKey: 'home.features.supportTitle',
    subtitleKey: 'home.features.supportSubtitle'
  },
]


const FeatureAreaTwo = () => {
  const { t } = useTranslation('common');
  return (
    <section className={`tp-feature-area tp-feature-border-2 pb-80`}>
      <div className="container">
        <div className="tp-feature-inner-2">
          <div className="row align-items-center">
            {feature_data.map((item, i) => (
              <div key={i} className="col-xl-3 col-lg-3 col-md-6 col-sm-6">
                <div className="tp-feature-item-2 d-flex align-items-start mb-40">
                  <div className="tp-feature-icon-2 mr-10">
                    <span>
                      {item.icon}
                    </span>
                  </div>
                  <div className="tp-feature-content-2">
                    <h3 className="tp-feature-title-2">{t(item.titleKey)}</h3>
                    <p>{t(item.subtitleKey)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAreaTwo;