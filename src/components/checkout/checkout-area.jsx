'use client';
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import Link from "next/link";
import { useTranslation } from "react-i18next";
// internal
import CheckoutBillingArea from "./checkout-billing-area";
import CheckoutOrderArea from "./checkout-order-area";
import useCheckoutSubmit from "@/hooks/use-checkout-submit";
import styles from "./checkout.module.scss";

const CheckoutArea = () => {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    const isAuthenticate = Cookies.get("userInfo");
    if(!isAuthenticate){
      router.push("/login")
    }
  },[router]);
  const checkoutData = useCheckoutSubmit();
  const {handleSubmit,submitHandler,register,errors} = checkoutData;
  const { cart_products } = useSelector((state) => state.cart);
  return (
    <>
      <section
        className={`tp-checkout-area ${styles.checkout}`}
      >
        <div className="container">
          <Link href="/cart" className={styles.back}>
            <span aria-hidden="true">←</span> {t("checkout.backToCart")}
          </Link>
          <div className={styles.heading}>
            <h1>{t("breadcrumb.checkout")}</h1>
            <p>{t("checkout.detailsHint")}</p>
          </div>
          {cart_products.length === 0 && (
            <div className="text-center pt-50">
              <h3 className="py-2">{t("checkout.emptyTitle")}</h3>
              <Link href="/shop" className="tp-checkout-btn">
                {t("checkout.returnToShop")}
              </Link>
            </div>
          )}
          {cart_products.length > 0 && (
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="row g-4 align-items-start">
                <div className="col-lg-7">
                  <CheckoutBillingArea register={register} errors={errors} />
                </div>
                <div className="col-lg-5">
                  <CheckoutOrderArea checkoutData={checkoutData} />
                </div>
              </div>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default CheckoutArea;
