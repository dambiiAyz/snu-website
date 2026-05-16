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

const DetailsWrapper = ({ productItem, handleImageActive, activeImg, detailsBottom = false }) => {
  const { t } = useTranslation('common');
  const { sku, title, imageURLs, category, description, discount, price, status, reviews, tags, offerDate } = productItem || {};
  const [ratingVal, setRatingVal] = useState(0);
  const [textMore, setTextMore] = useState(false);
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
    dispatch(add_cart_product(prd));
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
        <span>{category.name}</span>
      </div>
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
      <p>{textMore ? description : `${description.substring(0, 100)}...`}
        <span onClick={() => setTextMore(!textMore)}>{textMore ? t('productDetails.seeLess') : t('productDetails.seeMore')}</span>
      </p>

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
      {imageURLs.some(item => item?.color && item?.color?.name) && <div className="tp-product-details-variation">
        <div className="tp-product-details-variation-item">
          <h4 className="tp-product-details-variation-title">{t('productDetails.color')} :</h4>
          <div className="tp-product-details-variation-list">
            {imageURLs.map((item, i) => {
              const backgroundColor = getColorHex(item.color?.name);
              const needsBorder = isLightColor(backgroundColor);
              
              return (
                <button 
                  onClick={() => handleImageActive(item)} 
                  key={i} 
                  type="button"
                  className={`color tp-color-variation-btn ${item.img === activeImg ? "active" : ""}`}
                  title={item.color?.name}
                >
                  <span
                    data-bg-color={item.color?.name}
                    style={{ 
                      backgroundColor: backgroundColor
                    }}
                  ></span>
                  {item.color && item.color.name && (
                    <span className="tp-color-variation-tootltip">
                      {item.color.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>}

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