'use client';
import React from "react";
import Image from "next/image";
import { GoogleLogin } from "@react-oauth/google";
import { usePathname, useRouter } from "next/navigation";
// internal
import google_icon from "@assets/img/icon/login/google.svg";
import { useSignUpProviderMutation } from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import {
  clearPendingReferralCode,
  getPendingReferralCode,
} from "@/utils/referralStorage";
import { isGoogleClientConfigured } from "@/utils/google-auth-config";

const GoogleSignUp = () => {
  const [signUpProvider, {}] = useSignUpProviderMutation();
  const router = useRouter();
  const pathname = usePathname() || "";
  const isRegisterRoute = pathname.includes("/register");

  if (!isGoogleClientConfigured) {
    return (
      <button
        type="button"
        className="cursor-pointer"
        onClick={() =>
          notifyError(
            "Google login тохируулаагүй байна. NEXT_PUBLIC_GOOGLE_CLIENT_ID утгаа шалгана уу."
          )
        }
      >
        <Image src={google_icon} alt="google_icon" />
        Sign in with google
      </button>
    );
  }

  // handleGoogleSignIn
  const handleGoogleSignIn = (user) => {
    if (user) {
      const referralCode = isRegisterRoute
        ? getPendingReferralCode() || undefined
        : undefined;
      signUpProvider({ token: user?.credential, referralCode }).then((res) => {
        if (res?.data) {
          notifySuccess("Login success!");
          if (isRegisterRoute) clearPendingReferralCode();
          router.push('/checkout');
        } else {
          console.log("result error -->", res.error);
          notifyError(
            res.error?.data?.error ||
              res.error?.data?.message ||
              res.error?.message ||
              "Something went wrong"
          );
        }
      });
    }
  };
  return (
    <GoogleLogin
      render={(renderProps) => (
        <a
          className="cursor-pointer"
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
        >
          <Image src={google_icon} alt="google_icon" />
          Sign in with google
        </a>
      )}
      onSuccess={handleGoogleSignIn}
      onError={() =>
        notifyError("Google login тохиргоо буруу байна. Client ID болон Authorized origin шалгана уу.")
      }
      onFailure={(err) =>
        notifyError(err?.message || "Something wrong on your auth setup!")
      }
      cookiePolicy={"single_host_origin"}
    />
  );
};

export default GoogleSignUp;
