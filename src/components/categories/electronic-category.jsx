'use client'
import React from 'react';
import { useTranslation } from 'react-i18next';
// internal
import ErrorMsg from '../common/error-msg';
import { useGetProductTypeCategoryQuery } from '@/redux/features/categoryApi';
import HomeCateLoader from '../loader/home/home-cate-loader';
import ProductItem from '../products/electronics/product-item';

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
    content = category_items.map((item) => (
      <div className="tp-home-category-products mb-45" key={item._id}>
        <div className="tp-section-title-wrapper mb-25">
          <h3 className="tp-section-title">{item.parent}</h3>
        </div>
        <div className="row">
          {item.products?.slice(0, 20).map((product) => (
            <div className="col-xl-3 col-lg-3 col-sm-6" key={product._id}>
              <ProductItem product={product} />
            </div>
          ))}
        </div>
      </div>
    ))
  }
  return (
    <section className="tp-product-category pt-60 pb-15">
      <div className="container">
        {content}
      </div>
    </section>
  );
};

export default ElectronicCategory;
