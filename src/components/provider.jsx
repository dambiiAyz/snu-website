'use client'
import React from 'react';
import store from "@/redux/store";
import { Provider } from "react-redux";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { I18nextProvider } from "react-i18next";
import i18n from "@/i18n";

// stripePromise
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Providers = ({ children }) => {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Elements stripe={stripePromise}>
            {children}
          </Elements>
        </I18nextProvider>
      </Provider>
    </GoogleOAuthProvider>
  );
};

export default Providers;