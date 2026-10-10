'use client';
import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { usePathname, useRouter } from "next/navigation";
// internal
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
        Sign in with google
      </button>
    );
  }

  // handleGoogleSignIn
  const handleGoogleSignIn = (user) => {
    if (user?.credential) {
      const referralCode = isRegisterRoute
        ? getPendingReferralCode() || undefined
        : undefined;
      signUpProvider({ token: user.credential, referralCode }).then((res) => {
        if (res?.data) {
          notifySuccess("Login success!");
          if (isRegisterRoute) clearPendingReferralCode();
          router.push(isRegisterRoute ? '/checkout' : '/profile');
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
      onSuccess={handleGoogleSignIn}
      onError={() =>
        notifyError("Google login тохиргоо буруу байна. Client ID болон Authorized origin шалгана уу.")
      }
      text={isRegisterRoute ? "signup_with" : "signin_with"}
      shape="rectangular"
      size="large"
      theme="outline"
      width="280"
      use_fedcm_for_prompt
    />
  );
};

export default GoogleSignUp;
