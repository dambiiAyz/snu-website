'use client';
import React, { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import { useDispatch } from 'react-redux';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
// internal
import { AskQuestion, CompareTwo, WishlistTwo } from '@/svg';
import DetailsBottomInfo from './details-bottom-info';
import ProductDetailsCountdown from './product-details-countdown';
import ProductQuantity from './product-quantity';
import { add_cart_product } from '@/redux/features/cartSlice';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_to_compare } from '@/redux/features/compareSlice';
import { handleModalClose } from '@/redux/features/productModalSlice';
import { getColorHex, isLightColor } from '@/utils/colorUtils';
import { formatCurrency } from '@/utils/format-currency';

const getVariantColor = (color) =>
  typeof color === 'string' ? color : color?.hex || color?.code || color?.name;

const DetailsWrapper = ({ productItem, handleImageActive, activeImg, detailsBottom = false }) => {
  const { t } = useTranslation('common');
  const { sku, title, imageURLs, category, discount, price, status, reviews, tags, offerDate } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [sizeSelection, setSizeSelection] = useState(null);
  const activeVariant = imageURLs?.find((item) => item.img === activeImg) || imageURLs?.[0];
  const activeSizes = Array.isArray(activeVariant?.sizes)
    ? activeVariant.sizes.filter((size) => typeof size === 'string' && size.trim())
    : [];
  const selectedSize = sizeSelection?.image === activeVariant?.img && activeSizes.includes(sizeSelection.size)
    ? sizeSelection.size
    : activeSizes[0];
  const dispatch = useDispatch()

  useEffect(() => {
    if (reviews && reviews.length > 0) {
      const rating =
        reviews.reduce((acc, review) => acc + review.rating, 0) /
        reviews.length;
      setRatingVal(rating);
    } else {
      setRatingVal(0);
    }
  }, [reviews]);

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(activeSizes.length > 0
      ? { ...prd, selectedSize, selectedVariantImage: activeVariant?.img }
      : prd));
  };

  // handle wishlist product
  const handleWishlistProduct = (prd) => {
    dispatch(add_to_wishlist(prd));
  };

  // handle compare product
  const handleCompareProduct = (prd) => {
    dispatch(add_to_compare(prd));
  };

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category?.name}</span>
      </div>
      {(() => {
        const c = productItem?.company;
        const slug = c?.slug || productItem?.companySlug;
        const name = c?.name || productItem?.companyName;
        if (!slug || !name) return null;
        return (
          <div className="tp-product-details-vendor mb-10">
            <span className="text-muted">{t("companies.suppliedBy")} </span>
            <Link href={`/companies/${encodeURIComponent(String(slug))}`} className="tp-product-details-vendor-link">
              {name}
            </Link>
          </div>
        );
      })()}
      <h3 className="tp-product-details-title">{title}</h3>

      {/* inventory details */}
      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>
            {status === 'out-of-stock'
              ? t('product.status.outOfStock')
              : status === 'in-stock'
              ? t('product.status.inStock')
              : status}
          </span>
        </div>
        <div className="tp-product-details-rating-wrapper d-flex align-items-center mb-10">
          <div className="tp-product-details-rating">
            <Rating allowFraction size={16} initialValue={ratingVal} readonly={true} />
          </div>
          <div className="tp-product-details-reviews">
            <span>({reviews && reviews.length > 0 ? reviews.length : 0} {t('product.review')})</span>
          </div>
        </div>
      </div>
      {/* price */}
      <div className="tp-product-details-price-wrapper mb-20">
        {discount > 0 ? (
          <>
            <span className="tp-product-details-price old-price">{formatCurrency(price)}</span>
            <span className="tp-product-details-price new-price">
              {" "}
              {formatCurrency(
                Number(price) - (Number(price) * Number(discount)) / 100
              )}
            </span>
          </>
        ) : (
          <span className="tp-product-details-price new-price">{formatCurrency(price)}</span>
        )}
      </div>

      {/* variations */}
      {imageURLs.some(item => getVariantColor(item?.color)) && <div className="tp-product-details-variation">
        <div className="tp-product-details-variation-item">
          <h4 className="tp-product-details-variation-title">{t('productDetails.color')} :</h4>
          <div className="tp-product-details-variation-list">
            {imageURLs.filter((item) => getVariantColor(item?.color)).map((item, i) => {
              const colorValue = getVariantColor(item.color);
              const backgroundColor = getColorHex(colorValue);
              const needsBorder = isLightColor(backgroundColor);
              
              return (
                <button 
                  onClick={() => handleImageActive(item)} 
                  key={i} 
                  type="button"
                  className={`color tp-color-variation-btn ${item.img === activeImg ? "active" : ""}`}
                  title={item.color?.name || colorValue}
                  aria-label={item.color?.name || colorValue}
                >
                  <span
                    data-bg-color={colorValue}
                    style={{ 
                      backgroundColor: backgroundColor,
                      border: needsBorder ? '1px solid #d1d5db' : undefined
                    }}
                  ></span>
                  {colorValue && (
                    <span className="tp-color-variation-tootltip">
                      {item.color?.name || colorValue}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>}

      {activeSizes.length > 0 && (
        <div className="tp-product-details-variation mb-20">
          <div className="tp-product-details-variation-item">
            <h4 className="tp-product-details-variation-title">{t('productDetails.size')} :</h4>
            <div className="tp-product-details-variation-list d-flex flex-wrap gap-2" role="group" aria-label={t('productDetails.size')}>
              {activeSizes.map((size, index) => (
                <button
                  key={size + '-' + index}
                  type="button"
                  className={`tp-size-variation-btn ${selectedSize === size ? 'active' : ''}`}
                  aria-pressed={selectedSize === size}
                  onClick={() => setSizeSelection({ image: activeVariant?.img, size })}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* if ProductDetailsCountdown true start */}
      {offerDate?.endDate && <ProductDetailsCountdown offerExpiryTime={offerDate?.endDate} />}
      {/* if ProductDetailsCountdown true end */}

      {/* actions */}
      <div className="tp-product-details-action-wrapper">
        <h3 className="tp-product-details-action-title">{t('productDetails.quantity')}</h3>
        <div className="tp-product-details-action-item-wrapper d-sm-flex align-items-center">
          {/* product quantity */}
          <ProductQuantity />
          {/* product quantity */}
          <div className="tp-product-details-add-to-cart mb-15 w-100">
            <button onClick={() => handleAddProduct(productItem)} disabled={status === 'out-of-stock'} className="tp-product-details-add-to-cart-btn w-100">
              {t('product.actions.addToCart')}
            </button>
          </div>
        </div>
        <Link href="/cart" onClick={() => dispatch(handleModalClose())}>
          <button className="tp-product-details-buy-now-btn w-100">{t('productDetails.buyNow')}</button>
        </Link>
      </div>
      {/* product-details-action-sm start */}
      <div className="tp-product-details-action-sm">
        <button disabled={status === 'out-of-stock'} onClick={() => handleCompareProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <CompareTwo />
          {t('product.actions.addToCompare')}
        </button>
        <button disabled={status === 'out-of-stock'} onClick={() => handleWishlistProduct(productItem)} type="button" className="tp-product-details-action-sm-btn">
          <WishlistTwo />
          {t('product.actions.addToWishlist')}
        </button>
        <button type="button" className="tp-product-details-action-sm-btn">
          <AskQuestion />
          {t('productDetails.askQuestion')}
        </button>
      </div>
      {/* product-details-action-sm end */}

      {detailsBottom && <DetailsBottomInfo category={category?.name} sku={sku} tag={tags[0]} />}
    </div>
  );
};

export default DetailsWrapper;
