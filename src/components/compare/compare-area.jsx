'use client';
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import { useTranslation } from "react-i18next";
// internal
import { getDefaultVariant } from "@/utils/utils";
import { formatCurrency } from "@/utils/format-currency";
import { add_cart_product } from "@/redux/features/cartSlice";
import { remove_compare_product } from "@/redux/features/compareSlice";

const CompareArea = () => {
  const { t } = useTranslation("common");
  const { compareItems } = useSelector((state) => state.compare);
  const dispatch = useDispatch();

  // handle add product
  const handleAddProduct = (prd) => {
    dispatch(add_cart_product(prd));
  };
  // handle add product
  const handleRemoveComparePrd = (prd) => {
    dispatch(remove_compare_product(prd));
  };

  return (
    <>
      <section className="tp-compare-area pb-120">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              {compareItems.length === 0 && (
                <div className="text-center pt-50">
                  <h3>{t("compare.emptyTitle")}</h3>
                  <Link href="/shop" className="tp-cart-checkout-btn mt-20">
                    {t("compare.continueShopping")}
                  </Link>
                </div>
              )}
              {compareItems.length > 0 && (
                <div className="tp-compare-table table-responsive text-center">
                  <table className="table">
                    <tbody>
                      <tr>
                        <th>{t("compare.table.product")}</th>
                        {compareItems.map(item => (
                          <td key={item._id} className="">
                            <div className="tp-compare-thumb">
                              <Image
                                src={getDefaultVariant(item.imageURLs || [])?.img }
                                alt="compare"
                                width={205}
                                height={176}
                              />
                              <h4 className="tp-compare-product-title">
                                <Link href={`/product-details/${item._id}`}>
                                  {item.title}
                                </Link>
                              </h4>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Description */}
                      <tr>
                        <th>{t("compare.table.description")}</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-desc">
                              <p>
                                {t("compare.descriptionPlaceholder")}
                              </p>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Price */}
                      <tr>
                        <th>{t("compare.table.price")}</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-price">
                              <span>{formatCurrency(item.price)}</span>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Add to cart*/}
                      <tr>
                        <th>{t("compare.table.addToCart")}</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-add-to-cart">
                              <button onClick={() => handleAddProduct(item)} type="button" className="tp-btn">
                                {t("product.actions.addToCart")}
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Rating */}
                      <tr>
                        <th>{t("compare.table.rating")}</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-rating">
                              <Rating
                                allowFraction
                                size={16}
                                initialValue={item.reviews.length > 0 ? item.reviews.reduce((acc, review) => acc + review.rating, 0) / item.reviews.length : 0}
                                readonly={true}
                              />
                            </div>
                          </td>
                        ))}
                      </tr>
                      {/* Remove */}
                      <tr>
                        <th>{t("compare.table.remove")}</th>
                        {compareItems.map(item => (
                          <td key={item._id}>
                            <div className="tp-compare-remove">
                              <button onClick={()=>handleRemoveComparePrd({title:item.title,id:item._id })}>
                                <i className="fal fa-trash-alt"></i>
                              </button>
                            </div>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default CompareArea;
