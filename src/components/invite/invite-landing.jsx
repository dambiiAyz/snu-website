"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

const appStoreUrl =
  process.env.NEXT_PUBLIC_SNUU_APP_STORE_URL ||
  // Replace the test ID with the published App Store listing URL.
  "https://apps.apple.com/app/id0000000000";
const playStoreUrl =
  process.env.NEXT_PUBLIC_SNUU_PLAY_STORE_URL ||
  "https://play.google.com/store/apps/details?id=mn.snuu.mobile";

export default function InviteLanding({ referralCode }) {
  const { t } = useTranslation("common");
  const [isOpening, setIsOpening] = useState(false);
  const attemptedUrl = useRef("");
  const appUrl = referralCode
    ? `snuu://register?referralCode=${encodeURIComponent(referralCode)}`
    : "";
  const webUrl = referralCode
    ? `/register?ref=${encodeURIComponent(referralCode)}`
    : "/register";

  useEffect(() => {
    if (!appUrl || !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;

    setIsOpening(true);
    const timeout = window.setTimeout(() => setIsOpening(false), 1800);
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        window.clearTimeout(timeout);
        setIsOpening(false);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (attemptedUrl.current !== appUrl) {
      attemptedUrl.current = appUrl;
      window.location.assign(appUrl);
    }

    return () => {
      window.clearTimeout(timeout);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [appUrl]);

  return (
    <>
      <HeaderTwo style_2={true} />
      <main className="container py-5" style={{ minHeight: "55vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="border rounded-3 bg-white p-4 p-md-5 text-center">
              <h1 className="h3 mb-3">{t("invite.title")}</h1>
              {referralCode ? (
                <>
                  <p className="mb-2">{t("invite.description")}</p>
                  <p className="fw-bold mb-4">
                    {t("invite.code", { code: referralCode })}
                  </p>
                  {isOpening && (
                    <p className="text-muted" role="status">
                      {t("invite.opening")}
                    </p>
                  )}
                  <div className="d-flex flex-column gap-3 align-items-stretch">
                    <a className="tp-btn" href={appUrl}>
                      {t("invite.openApp")}
                    </a>
                    <a className="tp-btn tp-btn-border" href={webUrl}>
                      {t("invite.registerOnWeb")}
                    </a>
                  </div>
                </>
              ) : (
                <>
                  <p className="mb-4">{t("invite.invalidCode")}</p>
                  <a className="tp-btn" href={webUrl}>
                    {t("invite.registerOnWeb")}
                  </a>
                </>
              )}
              <div className="border-top mt-4 pt-4">
                <p className="mb-3">{t("invite.download")}</p>
                <div className="d-flex flex-wrap justify-content-center gap-3">
                  <a href={appStoreUrl} target="_blank" rel="noopener noreferrer">
                    {t("invite.appStore")}
                  </a>
                  <a href={playStoreUrl} target="_blank" rel="noopener noreferrer">
                    {t("invite.playStore")}
                  </a>
                </div>
                <p className="small text-muted mt-3 mb-0">
                  {t("invite.afterInstall")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer primary_style={true} />
    </>
  );
}
