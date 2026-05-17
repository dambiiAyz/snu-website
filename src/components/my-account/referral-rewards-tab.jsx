'use client';

import React, { useMemo, useState } from "react";
import QRCode from "react-qr-code";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import {
  useReferralInfoQuery,
  useWalletQuery,
  useWalletTransactionsQuery,
} from "@/redux/features/auth/authApi";
import { notifyError, notifySuccess } from "@/utils/toast";
import Loader from "@/components/loader/loader";

function pickNumberLocale(lang) {
  if (lang === "mn") return "mn-MN";
  if (lang === "cz") return "zh-CN";
  return "en-US";
}

function formatMnt(amount, lang) {
  const n = Number(amount);
  if (Number.isNaN(n)) return "—";
  return `${n.toLocaleString(pickNumberLocale(lang))} ₮`;
}

const ReferralRewardsTab = () => {
  const { t, i18n } = useTranslation("common");
  const lang = i18n.resolvedLanguage || i18n.language || "en";
  const { accessToken } = useSelector((state) => state.auth);
  const skip = !accessToken;
  const [txPage, setTxPage] = useState(1);
  const txLimit = 20;

  const {
    data: referralRes,
    isLoading: refLoading,
    isError: refError,
    error: refErrObj,
  } = useReferralInfoQuery(undefined, { skip });

  const {
    data: walletRes,
    isLoading: walletLoading,
    isError: walletError,
    error: walletErrObj,
  } = useWalletQuery(undefined, { skip });

  const {
    data: txRes,
    isLoading: txLoading,
    isFetching: txFetching,
  } = useWalletTransactionsQuery({ page: txPage, limit: txLimit }, { skip });

  const referral = referralRes?.data?.data ?? referralRes?.data;
  const wallet = walletRes?.data?.data ?? walletRes?.data;
  const txPayload = txRes?.data?.data ?? txRes?.data;
  const txItems = txPayload?.items ?? [];
  const txTotal = txPayload?.total ?? 0;
  const txLimitResp = txPayload?.limit ?? txLimit;
  const txPageResp = txPayload?.page ?? txPage;
  const maxPage = Math.max(1, Math.ceil(txTotal / txLimitResp) || 1);

  const inviteLink = useMemo(() => {
    if (typeof window === "undefined" || !referral?.referralCode) return "";
    const origin = window.location.origin;
    return `${origin}/register?ref=${encodeURIComponent(referral.referralCode)}`;
  }, [referral?.referralCode]);

  const copyCode = async () => {
    if (!referral?.referralCode) return;
    try {
      await navigator.clipboard.writeText(referral.referralCode);
      notifySuccess(t("profile.rewards.toast.codeCopied"));
    } catch {
      notifyError(t("profile.rewards.toast.copyFailed"));
    }
  };

  const copyLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      notifySuccess(t("profile.rewards.toast.linkCopied"));
    } catch {
      notifyError(t("profile.rewards.toast.copyFailed"));
    }
  };

  const loading = skip || refLoading || walletLoading;
  const listErr =
    (refError && (refErrObj?.data?.error || refErrObj?.data?.message)) ||
    (walletError && (walletErrObj?.data?.error || walletErrObj?.data?.message));

  if (loading) {
    return (
      <div className="profile__info d-flex justify-content-center py-5">
        <Loader loading={true} />
      </div>
    );
  }

  if (listErr) {
    return (
      <div className="profile__info">
        <h3 className="profile__info-title">{t("profile.rewards.errorTitle")}</h3>
        <p className="text-danger mb-0">{listErr}</p>
      </div>
    );
  }

  return (
    <div className="profile__info">
      <h3 className="profile__info-title">{t("profile.rewards.title")}</h3>
      <p className="mb-30">{t("profile.rewards.intro")}</p>

      <div className="row g-3 mb-40">
        <div className="col-md-6">
          <div className="profile__input-box p-4 border rounded-3 h-100">
            <h4 className="h6 mb-15">{t("profile.rewards.referralCodeTitle")}</h4>
            <p className="fw-bold fs-5 mb-15">{referral?.referralCode || "—"}</p>
            <div className="d-flex flex-wrap gap-2">
              <button type="button" className="tp-btn tp-btn-sm" onClick={copyCode}>
                {t("profile.rewards.copyCode")}
              </button>
              <button type="button" className="tp-btn tp-btn-border tp-btn-sm" onClick={copyLink}>
                {t("profile.rewards.copyLink")}
              </button>
            </div>
            {inviteLink ? (
              <div className="mt-4 pt-4 border-top">
                <h4 className="h6 mb-10">{t("profile.rewards.qrTitle")}</h4>
                <p className="small text-muted mb-15">
                  {t("profile.rewards.qrHint")}
                </p>
                <div
                  className="d-inline-block p-12 bg-white rounded-2 border"
                  role="img"
                  aria-label={t("profile.rewards.qrAria")}
                >
                  <QRCode
                    value={inviteLink}
                    size={176}
                    level="M"
                    style={{ height: "auto", maxWidth: "100%", width: 176 }}
                  />
                </div>
              </div>
            ) : null}
            {referral?.invitedByUserId != null && (
              <p className="small text-muted mt-15 mb-0">
                {t("profile.rewards.invitedBy", {
                  id: String(referral.invitedByUserId),
                })}
              </p>
            )}
          </div>
        </div>
        <div className="col-md-6">
          <div className="profile__input-box p-4 border rounded-3 h-100">
            <h4 className="h6 mb-15">{t("profile.rewards.walletTitle")}</h4>
            <ul className="list-unstyled mb-0">
              <li className="d-flex justify-content-between py-1">
                <span>{t("profile.rewards.balance")}</span>
                <strong>{formatMnt(wallet?.balance, lang)}</strong>
              </li>
              <li className="d-flex justify-content-between py-1">
                <span>{t("profile.rewards.totalEarned")}</span>
                <strong>{formatMnt(wallet?.totalEarned, lang)}</strong>
              </li>
              <li className="d-flex justify-content-between py-1">
                <span>{t("profile.rewards.totalWithdrawn")}</span>
                <strong>{formatMnt(wallet?.totalWithdrawn, lang)}</strong>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h4 className="h6 mb-15">{t("profile.rewards.transactionsTitle")}</h4>
      {txLoading && txItems.length === 0 ? (
        <Loader loading={true} />
      ) : txItems.length === 0 ? (
        <p className="text-muted">{t("profile.rewards.noTransactions")}</p>
      ) : (
        <>
          <div className="profile__ticket table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">{t("profile.rewards.columns.date")}</th>
                  <th scope="col">{t("profile.rewards.columns.type")}</th>
                  <th scope="col">{t("profile.rewards.columns.amount")}</th>
                  <th scope="col">{t("profile.rewards.columns.balanceAfter")}</th>
                  <th scope="col">{t("profile.rewards.columns.reference")}</th>
                </tr>
              </thead>
              <tbody>
                {txItems.map((row, idx) => (
                  <tr key={row._id || idx}>
                    <td>
                      {row.createdAt
                        ? new Date(row.createdAt).toLocaleString(pickNumberLocale(lang))
                        : "—"}
                    </td>
                    <td>{row.type}</td>
                    <td>{formatMnt(row.amount, lang)}</td>
                    <td>{formatMnt(row.balanceAfter, lang)}</td>
                    <td>
                      {row.referenceType}
                      {row.metadata ? (
                        <span className="text-muted small d-block">
                          {JSON.stringify(row.metadata)}
                        </span>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-20">
            <span className="small text-muted">
              {t("profile.rewards.pagination", {
                page: txPageResp,
                max: maxPage,
                total: txTotal,
              })}
            </span>
            <div className="d-flex gap-2">
              <button
                type="button"
                className="tp-btn tp-btn-border tp-btn-sm"
                disabled={txPage <= 1 || txFetching}
                onClick={() => setTxPage((p) => Math.max(1, p - 1))}
              >
                {t("profile.rewards.previous")}
              </button>
              <button
                type="button"
                className="tp-btn tp-btn-border tp-btn-sm"
                disabled={txPage >= maxPage || txFetching}
                onClick={() => setTxPage((p) => p + 1)}
              >
                {t("profile.rewards.next")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ReferralRewardsTab;
