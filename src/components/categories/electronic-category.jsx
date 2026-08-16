'use client'
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// internal
import ErrorMsg from '../common/error-msg';
import { useGetProductTypeCategoryQuery } from '@/redux/features/categoryApi';
import HomeCateLoader from '../loader/home/home-cate-loader';
import ProductItem from '../products/electronics/product-item';
import { ArrowNextSm, ArrowPrevSm } from '@/svg';

const categoryProductSlider = {
  slidesPerView: 5,
  spaceBetween: 18,
  breakpoints: {
    0: {
      slidesPerView: 2,
      spaceBetween: 12,
    },
    576: {
      slidesPerView: 3,
      spaceBetween: 14,
    },
    992: {
      slidesPerView: 4,
      spaceBetween: 16,
    },
    1200: {
      slidesPerView: 5,
      spaceBetween: 18,
    },
  },
};

const ElectronicCategory = () => {
  const { t } = useTranslation('common');
  const { data: categories, isLoading, isError } = useGetProductTypeCategoryQuery('electronics');
  // decide what to render
  let content = null;

  if (isLoading) {
    content = (
      <HomeCateLoader loading={isLoading} />
    );
  }
  if (!isLoading && isError) {
    content = <ErrorMsg msg={t('errors.generic')} />;
  }
  if (!isLoading && !isError && categories?.result?.length === 0) {
    content = <ErrorMsg msg={t('errors.noCategories')} />;
  }
  if (!isLoading && !isError && categories?.result?.length > 0) {
    const category_items = categories.result.filter((item) => item.products?.length > 0);
    content = category_items.map((item) => {
      const products = item.products?.slice(0, 20) || [];
      const showNavigation = products.length > 5;
      const sliderId = item._id;

      return (
        <div className="tp-home-category-products mb-45" key={item._id}>
          <div className="tp-section-title-wrapper mb-25">
            <h3 className="tp-section-title">{item.parent}</h3>
          </div>
          <div className="tp-home-category-slider p-relative d-none d-md-block">
            {showNavigation && (
              <>
                <button
                  type="button"
                  className={`tp-home-category-arrow tp-home-category-arrow-prev tp-home-category-prev-${sliderId}`}
                  aria-label="Previous products"
                >
                  <ArrowPrevSm />
                </button>
                <button
                  type="button"
                  className={`tp-home-category-arrow tp-home-category-arrow-next tp-home-category-next-${sliderId}`}
                  aria-label="Next products"
                >
                  <ArrowNextSm />
                </button>
              </>
            )}
            <Swiper
              {...categoryProductSlider}
              modules={[Navigation]}
              navigation={showNavigation ? {
                prevEl: `.tp-home-category-prev-${sliderId}`,
                nextEl: `.tp-home-category-next-${sliderId}`,
              } : false}
              className="tp-home-category-product-slider swiper-container"
            >
              {products.map((product) => (
                <SwiperSlide key={product._id}>
                  <ProductItem product={product} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="tp-home-category-mobile-grid d-grid d-md-none">
            {products.map((product) => (
              <ProductItem product={product} key={product._id} />
            ))}
          </div>
        </div>
      );
    })
  }
  return (
    <section className="tp-product-category tp-home-category-section pt-60 pb-15">
      <div className="container">
        {content}
      </div>
    </section>
  );
};

export default ElectronicCategory;
