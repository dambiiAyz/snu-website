import { apiSlice } from "../../api/apiSlice";
import { set_client_secret } from "./orderSlice";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // createPaymentIntent
    createPaymentIntent: builder.mutation({
      query: (data) => ({
        url: "api/order/create-payment-intent",
        method: "POST",
        body: data,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(set_client_secret(result.clientSecret));
        } catch (err) {
          // do nothing
        }
      },

    }),
    // saveOrder
    saveOrder: builder.mutation({
      query: (data) => ({
        url: "api/order/saveOrder",
        method: "POST",
        body: data,
      }),
      invalidatesTags:['UserOrders'],

    }),
    // createQpayInvoice
    createQpayInvoice: builder.mutation({
      query: (data) => ({
        url: "api/qpay/invoice",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["UserOrders"],
    }),
    // checkQpayInvoice
    checkQpayInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `api/qpay/invoice/${invoiceId}/check`,
        method: "POST",
      }),
      invalidatesTags: (result, error, arg) => [
        "UserOrders",
        { type: "UserOrder", id: result?.data?.order?._id },
      ],
    }),
    // cancelQpayInvoice
    cancelQpayInvoice: builder.mutation({
      query: (invoiceId) => ({
        url: `api/qpay/invoice/${invoiceId}`,
        method: "DELETE",
      }),
    }),
    // getUserOrders
    getUserOrders: builder.query({
      query: () => `/api/user-order`,
      providesTags:["UserOrders"],
      keepUnusedDataFor: 600,
    }),
    // getUserOrders
    getUserOrderById: builder.query({
      query: (id) => `/api/user-order/${id}`,
      providesTags: (result, error, arg) => [{ type: "UserOrder", id: arg }],
      keepUnusedDataFor: 600,
    }),
  }),
});

export const {
  useCreatePaymentIntentMutation,
  useCreateQpayInvoiceMutation,
  useCheckQpayInvoiceMutation,
  useCancelQpayInvoiceMutation,
  useSaveOrderMutation,
  useGetUserOrderByIdQuery,
  useGetUserOrdersQuery,
} = authApi;
