'use client';
import * as dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
//internal import
import useCartInfo from "./use-cart-info";
import { set_shipping } from "@/redux/features/order/orderSlice";
import { set_coupon } from "@/redux/features/coupon/couponSlice";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  useCheckQpayInvoiceMutation,
  useCreatePaymentIntentMutation,
  useCreateQpayInvoiceMutation,
  useSaveOrderMutation,
} from "@/redux/features/order/orderApi";
import { useGetOfferCouponsQuery } from "@/redux/features/coupon/couponApi";
import { formatCurrency } from "@/utils/format-currency";
import { getCheckoutDefaults } from "@/utils/checkout-defaults";

const useCheckoutSubmit = () => {
  // offerCoupons
  const { data: offerCoupons, isError, isLoading } = useGetOfferCouponsQuery();
  // addOrder
  const [saveOrder, {}] = useSaveOrderMutation();
  // createPaymentIntent
  const [createPaymentIntent, {}] = useCreatePaymentIntentMutation();
  // qpay
  const [createQpayInvoice, {}] = useCreateQpayInvoiceMutation();
  const [checkQpayInvoice, {}] = useCheckQpayInvoiceMutation();
  // cart_products
  const { cart_products } = useSelector((state) => state.cart);
  // user
  const { user } = useSelector((state) => state.auth);
  // shipping_info
  const { shipping_info } = useSelector((state) => state.order);
  // total amount
  const { total, setTotal } = useCartInfo();
  // couponInfo
  const [couponInfo, setCouponInfo] = useState({});
  //cartTotal
  const [cartTotal, setCartTotal] = useState("");
  // minimumAmount
  const [minimumAmount, setMinimumAmount] = useState(0);
  // shippingCost
  const [shippingCost, setShippingCost] = useState(0);
  // discountAmount
  const [discountAmount, setDiscountAmount] = useState(0);
  // discountPercentage
  const [discountPercentage, setDiscountPercentage] = useState(0);
  // discountProductType
  const [discountProductType, setDiscountProductType] = useState("");
  // isCheckoutSubmit
  const [isCheckoutSubmit, setIsCheckoutSubmit] = useState(false);
  // cardError
  const [cardError, setCardError] = useState("");
  // clientSecret
  const [clientSecret, setClientSecret] = useState("");
  // showCard
  const [showCard, setShowCard] = useState(false);
  // qpay invoice
  const [qpayPayment, setQpayPayment] = useState(null);
  const [isCheckingQpay, setIsCheckingQpay] = useState(false);
  // coupon apply message
  const [couponApplyMsg,setCouponApplyMsg] = useState("");

  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const {register,handleSubmit,setValue,getValues,watch,formState: { errors, dirtyFields }} = useForm();
  const selectedPayment = watch("payment");

  let couponRef = useRef("");

  const clearCheckoutStorage = () => {
    localStorage.removeItem("cart_products");
    localStorage.removeItem("couponInfo");
    localStorage.removeItem("shipping_info");
  };

  useEffect(() => {
    if (localStorage.getItem("couponInfo")) {
      const data = localStorage.getItem("couponInfo");
      const coupon = JSON.parse(data);
      setCouponInfo(coupon);
      setDiscountPercentage(coupon.discountPercentage);
      setMinimumAmount(coupon.minimumAmount);
      setDiscountProductType(coupon.productType);
    }
  }, []);

  useEffect(() => {
    if (minimumAmount - discountAmount > total || cart_products.length === 0) {
      setDiscountPercentage(0);
      localStorage.removeItem("couponInfo");
    }
  }, [minimumAmount, total, discountAmount, cart_products]);

  //calculate total and discount value
  useEffect(() => {
    const result = cart_products?.filter(
      (p) => p.productType === discountProductType
    );
    const discountProductTotal = result?.reduce(
      (preValue, currentValue) =>
        preValue + currentValue.price * currentValue.orderQuantity,
      0
    );
    let totalValue = "";
    let subTotal = Number((total + shippingCost).toFixed(2));
    let discountTotal = Number(
      discountProductTotal * (discountPercentage / 100)
    );
    totalValue = Number(subTotal - discountTotal);
    setDiscountAmount(discountTotal);
    setCartTotal(totalValue);
  }, [
    total,
    shippingCost,
    discountPercentage,
    cart_products,
    discountProductType,
    discountAmount,
    cartTotal,
  ]);

  // create payment intent
  useEffect(() => {
    if (selectedPayment === "Card" && cartTotal) {
      createPaymentIntent({
        price: parseInt(cartTotal),
      })
        .then((data) => {
          setClientSecret(data?.data?.clientSecret);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [createPaymentIntent, cartTotal, selectedPayment]);

  // handleCouponCode
  const handleCouponCode = (e) => {
    e.preventDefault();

    if (!couponRef.current?.value) {
      notifyError("Please Input a Coupon Code!");
      return;
    }
    if (isLoading) {
      return <h3>Loading...</h3>;
    }
    if (isError) {
      return notifyError("Something went wrong");
    }
    const result = offerCoupons?.filter(
      (coupon) => coupon.couponCode === couponRef.current?.value
    );

    if (result.length < 1) {
      notifyError("Please Input a Valid Coupon!");
      return;
    }

    if (dayjs().isAfter(dayjs(result[0]?.endTime))) {
      notifyError("This coupon is not valid!");
      return;
    }

    if (total < result[0]?.minimumAmount) {
      notifyError(
        `Minimum ${formatCurrency(result[0].minimumAmount)} required for Apply this coupon!`
      );
      return;
    } else {
      // notifySuccess(
      //   `Your Coupon ${result[0].title} is Applied on ${result[0].productType}!`
      // );
      setCouponApplyMsg(`Your Coupon ${result[0].title} is Applied on ${result[0].productType} productType!`)
      setMinimumAmount(result[0]?.minimumAmount);
      setDiscountProductType(result[0].productType);
      setDiscountPercentage(result[0].discountPercentage);
      dispatch(set_coupon(result[0]));
      setTimeout(() => {
        couponRef.current.value = "";
        setCouponApplyMsg("")
      }, 5000);
    }
  };

  // handleShippingCost
  const handleShippingCost = (value) => {
    setShippingCost(value);
  };

  // Fill available details without overwriting edits or another account's address.
  useEffect(() => {
    if (!user) return;
    let saved = shipping_info;
    if (!saved || Object.keys(saved).length === 0) {
      try {
        saved = JSON.parse(localStorage.getItem("shipping_info") || "{}");
      } catch {
        saved = {};
      }
    }
    const values = getCheckoutDefaults(user, saved || {});
    Object.entries(values).forEach(([field, value]) => {
      if (value && !dirtyFields[field] && !getValues(field)) {
        setValue(field, value);
      }
    });
  }, [user, shipping_info, setValue, getValues, dirtyFields]);

  // submitHandler
  const submitHandler = async (data) => {
    dispatch(set_shipping({ ...data, userId: user?._id }));
    setIsCheckoutSubmit(true);

    let orderInfo = {
      name: `${data.firstName} ${data.lastName}`,
      address: data.address,
      contact: data.contactNo,
      email: data.email,
      city: data.city,
      country: data.country,
      zipCode: data.zipCode,
      shippingOption: data.shippingOption,
      status: "Pending",
      cart: cart_products,
      paymentMethod: data.payment,
      subTotal: total,
      shippingCost: shippingCost,
      discount: discountAmount,
      totalAmount: cartTotal,
      orderNote:data.orderNote,
      user: `${user?._id}`,
    };
    if (data.payment === 'Card') {
      if (!stripe || !elements) {
        return;
      }
      const card = elements.getElement(CardElement);
      if (card == null) {
        return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: card,
      });
      if (error && !paymentMethod) {
        setCardError(error.message);
        setIsCheckoutSubmit(false);
      } else {
        setCardError('');
        const orderData = {
          ...orderInfo,
          cardInfo: paymentMethod,
        };

       return handlePaymentWithStripe(orderData);
      }
    }
    if (data.payment === "QPay") {
      try {
        const savedOrder = await saveOrder({ ...orderInfo }).unwrap();
        const order = savedOrder?.order || savedOrder?.data?.order;
        const orderId = order?._id;

        if (!orderId) {
          notifyError("Order created, but order id was not returned.");
          setIsCheckoutSubmit(false);
          return;
        }

        const invoiceResult = await createQpayInvoice({ orderId }).unwrap();
        const invoice = invoiceResult?.data?.invoice || invoiceResult?.invoice;

        if (!invoice?.invoice_id) {
          notifyError("QPay invoice could not be created.");
          setIsCheckoutSubmit(false);
          return;
        }

        setQpayPayment({
          orderId,
          invoice,
          paid: false,
        });
        setIsCheckoutSubmit(false);
        notifySuccess("QPay invoice created. Please complete your payment.");
      } catch (err) {
        notifyError(err?.data?.message || "QPay invoice could not be created.");
        setIsCheckoutSubmit(false);
      }
      return;
    }

    if (data.payment === 'COD') {
      try {
        const res = await saveOrder({ ...orderInfo }).unwrap();
        const order = res?.order || res?.data?.order;
        clearCheckoutStorage();
        setIsCheckoutSubmit(false)
        notifySuccess("Your Order Confirmed!");
        router.push(`/order/${order?._id}`);
      } catch (err) {
        notifyError(err?.data?.message || "Order could not be confirmed.");
        setIsCheckoutSubmit(false);
      }
    }
  };

  const handleCheckQpayPayment = async () => {
    if (!qpayPayment?.invoice?.invoice_id) {
      return;
    }

    setIsCheckingQpay(true);
    try {
      const result = await checkQpayInvoice(qpayPayment.invoice.invoice_id).unwrap();
      const paid = result?.data?.paid === true;
      const order = result?.data?.order || result?.order;

      if (paid) {
        setQpayPayment((prev) => ({ ...prev, paid: true }));
        clearCheckoutStorage();
        notifySuccess("Төлбөр амжилттай төлөгдлөө");
        router.push(`/order/${order?._id || qpayPayment.orderId}`);
      } else {
        notifyError("Төлбөр хараахан баталгаажаагүй байна.");
      }
    } catch (err) {
      notifyError(err?.data?.message || "Төлбөр шалгах үед алдаа гарлаа.");
    } finally {
      setIsCheckingQpay(false);
    }
  };

  // handlePaymentWithStripe
  const handlePaymentWithStripe = async (order) => {
    try {
      const {paymentIntent, error:intentErr} = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: user?.firstName,
              email: user?.email,
            },
          },
        },
      );
      if (intentErr) {
        notifyError(intentErr.message);
      } else {
        // notifySuccess("Your payment processed successfully");
      }

      const orderData = {
        ...order,
        paymentIntent,
      };

      saveOrder({
        ...orderData
      })
      .then((result) => {
          if(result?.error){
          }
          else {
            clearCheckoutStorage();
            notifySuccess("Your Order Confirmed!");
            router.push(`/order/${result.data?.order?._id}`);
          }
        })
       } 
    catch (err) {
      console.log(err);
    }
  };

  return {
    handleCouponCode,
    couponRef,
    handleShippingCost,
    discountAmount,
    total,
    shippingCost,
    discountPercentage,
    discountProductType,
    isCheckoutSubmit,
    setTotal,
    register,
    errors,
    cardError,
    submitHandler,
    selectedPayment,
    stripe,
    handleSubmit,
    clientSecret,
    setClientSecret,
    cartTotal,
    isCheckoutSubmit,
    couponApplyMsg,
    showCard,
    setShowCard,
    qpayPayment,
    isCheckingQpay,
    handleCheckQpayPayment,
  };
};

export default useCheckoutSubmit;
