import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Rating } from "react-simple-star-rating";
import dayjs from "dayjs";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
// internal
import { Cart, QuickView, Wishlist } from "@/svg";
import Timer from "@/components/common/timer";
import { handleProductModal } from "@/redux/features/productModalSlice";
import { add_cart_product } from "@/redux/features/cartSlice";
import { add_to_wishlist } from "@/redux/features/wishlist-slice";
import { getDefaultVariant } from "@/utils/utils";
import { formatCurrency } from "@/utils/format-currency";

const ProductItem = ({ product, offer_style = false }) => {
  const { t } = useTranslation("common");
  const { _id,category, title, reviews, price, discount,status,offerDate } = product || {};
  const default_item = getDefaultVariant(product.imageURLs || []);
  const { cart_products } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const isAddedToCart = cart_products.some((prd) => prd._id === _id);
  const isAddedToWishlist = wishlist.some((prd) => prd._id === _id);
  const dispatch = useDispatch();
  const [ratingVal, setRatingVal] = useState(0);
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

  return (
    <>
      <div
        className={`${offer_style ? "tp-product-offer-item" : "mb-25"
          } tp-product-item transition-3`}
      >
        <div className="tp-product-thumb p-relative fix">
          <Link href={`/product-details/${_id}`}>
            <Image
              src={default_item?.img}
              width="0"
              height="0"
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              alt="product-electronic"
            />

            <div className="tp-product-badge">
              {status === 'out-of-stock' && (
                <span className="product-hot">{t("product.badge.outOfStock")}</span>
              )}
            </div>
          </Link>

          {/*  product action */}
          <div className="tp-product-action">
            <div className="tp-product-action-item d-flex flex-column">
              {isAddedToCart ? (
                <Link
                  href="/cart"
                  className={`tp-product-action-btn ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
                >
                  <Cart /> <span className="tp-product-tooltip">{t("product.actions.viewCart")}</span>
                </Link>
              ) : (
                <button
                  onClick={() => handleAddProduct(product)}
                  type="button"
                  className={`tp-product-action-btn ${isAddedToCart ? 'active' : ''} tp-product-add-cart-btn`}
                  disabled={status === 'out-of-stock'}
                >
                  <Cart />

                  <span className="tp-product-tooltip">{t("product.actions.addToCart")}</span>
                </button>
              )}
              <button
                onClick={() => dispatch(handleProductModal(product))}
                type="button"
                className="tp-product-action-btn tp-product-quick-view-btn"
              >
                <QuickView />

                <span className="tp-product-tooltip">{t("product.actions.quickView")}</span>
              </button>
              <button
                type="button"
                className={`tp-product-action-btn ${isAddedToWishlist ? 'active' : ''} tp-product-add-to-wishlist-btn`}
                onClick={() => handleWishlistProduct(product)}
                disabled={status === 'out-of-stock'}
              >
                <Wishlist />
                <span className="tp-product-tooltip">{t("product.actions.addToWishlist")}</span>
              </button>
            </div>
          </div>
        </div>
        {/*  product content */}
        <div className="tp-product-content">
          <div className="tp-product-category">
            <a href="#">{category?.name}</a>
          </div>
          <h3 className="tp-product-title">
            <Link href={`/product-details/${_id}`}>{title}</Link>
          </h3>
          <div className="tp-product-rating d-flex align-items-center">
            <div className="tp-product-rating-icon">
              <Rating
                allowFraction
                size={16}
                initialValue={ratingVal}
                readonly={true}
              />
            </div>
            <div className="tp-product-rating-text">
              <span>
                ({reviews && reviews.length > 0 ? reviews.length : 0} {t("product.review")})
              </span>
            </div>
          </div>
          <div className="tp-product-price-wrapper">
            {discount > 0 ? (
              <>
                <span className="tp-product-price old-price">{formatCurrency(price)}</span>
                <span className="tp-product-price new-price">
                  {" "}
                  {formatCurrency(
                    Number(price) - (Number(price) * Number(discount)) / 100
                  )}
                </span>
              </>
            ) : (
              <span className="tp-product-price new-price">{formatCurrency(parseFloat(price))}</span>
            )}
          </div>
          {offer_style && (
            <div className="tp-product-countdown">
              <div className="tp-product-countdown-inner">
                {dayjs().isAfter(offerDate?.endDate) ? (
                  <ul>
                    <li>
                      <span>{0}</span> {t("product.timer.day")}
                    </li>
                    <li>
                      <span>{0}</span> {t("product.timer.hours")}
                    </li>
                    <li>
                      <span>{0}</span> {t("product.timer.minutes")}
                    </li>
                    <li>
                      <span>{0}</span> {t("product.timer.seconds")}
                    </li>
                  </ul>
                ) : (
                  <Timer expiryTimestamp={new Date(offerDate?.endDate)} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductItem;
