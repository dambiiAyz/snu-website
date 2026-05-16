'use client';
import React,{useMemo, useState} from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { Rating } from "react-simple-star-rating";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
// internal
import ErrorMsg from "../common/error-msg";
import { useAddReviewMutation } from "@/redux/features/reviewApi";
import { notifyError, notifySuccess } from "@/utils/toast";

const ReviewForm = ({product_id}) => {
  const { t } = useTranslation("common");
  const { user } = useSelector((state) => state.auth);
  const [rating, setRating] = useState(0);
  const [addReview, {}] = useAddReviewMutation();
  const schema = useMemo(() => Yup.object().shape({
    name: Yup.string().required().label(t("productDetails.reviewForm.labels.name")),
    email: Yup.string().required().email().label(t("productDetails.reviewForm.labels.email")),
    comment: Yup.string().required().label(t("productDetails.reviewForm.labels.comment")),
  }), [t]);

  // Catch Rating value
  const handleRating = (rate) => {
    setRating(rate)
  }

   // react hook form
   const {register,handleSubmit,formState: { errors },reset} = useForm({
    resolver: yupResolver(schema),
  });
  // on submit
  const onSubmit = (data) => {
    if(!user){
      notifyError(t("productDetails.reviewForm.pleaseLogin"));
      return;
    }
    else {
      addReview({
        userId: user?._id,
        productId: product_id,
        rating: rating,
        comment: data.comment,
      }).then((result) => {
        if (result?.error) {
          notifyError(result?.error?.data?.message);
        } else {
          notifySuccess(result?.data?.message);
        }
      });
    }
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="tp-product-details-review-form-rating d-flex align-items-center">
        <p>{t("productDetails.reviewForm.yourRating")} :</p>
        <div className="tp-product-details-review-form-rating-icon d-flex align-items-center">
          <Rating onClick={handleRating} allowFraction size={16} initialValue={rating} />
        </div>
      </div>
      <div className="tp-product-details-review-input-wrapper">
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <textarea
            {...register("comment", { required: t("productDetails.reviewForm.errors.comment") })}
              id="comment"
              name="comment"
              placeholder={t("productDetails.reviewForm.placeholders.comment")}
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="msg">{t("productDetails.reviewForm.labels.comment")}</label>
          </div>
          <ErrorMsg msg={errors.name?.comment} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("name", { required: t("productDetails.reviewForm.errors.name") })}
              name="name"
              id="name"
              type="text"
              placeholder={t("productDetails.reviewForm.placeholders.name")}
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="name">{t("productDetails.reviewForm.labels.name")}</label>
          </div>
          <ErrorMsg msg={errors.name?.name} />
        </div>
        <div className="tp-product-details-review-input-box">
          <div className="tp-product-details-review-input">
            <input
            {...register("email", { required: t("productDetails.reviewForm.errors.email") })}
              name="email"
              id="email"
              type="email"
              placeholder={t("productDetails.reviewForm.placeholders.email")}
            />
          </div>
          <div className="tp-product-details-review-input-title">
            <label htmlFor="email">{t("productDetails.reviewForm.labels.email")}</label>
          </div>
          <ErrorMsg msg={errors.name?.email} />
        </div>
      </div>
      <div className="tp-product-details-review-btn-wrapper">
        <button type="submit" className="tp-product-details-review-btn">{t("productDetails.reviewForm.submit")}</button>
      </div>
    </form>
  );
};

export default ReviewForm;
