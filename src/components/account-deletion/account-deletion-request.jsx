"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.snuu.mn";

export default function AccountDeletionRequest() {
  const { t } = useTranslation("common");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const hashToken = new URLSearchParams(window.location.hash.slice(1)).get("token") || "";
    if (/^[a-f0-9]{64}$/.test(hashToken)) setToken(hashToken);
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/user/account-deletion/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (!response.ok) throw new Error("Request failed");
      setEmail("");
      setMessage(t("accountDeletion.emailSent"));
    } catch {
      setError(t("accountDeletion.error"));
    } finally {
      setBusy(false);
    }
  };

  const confirm = async () => {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const response = await fetch(`${apiBaseUrl}/api/user/account-deletion/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!response.ok) throw new Error("Confirmation failed");
      setToken("");
      window.history.replaceState(null, "", window.location.pathname);
      setMessage(t("accountDeletion.confirmed"));
    } catch {
      setError(t("accountDeletion.invalidLink"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <HeaderTwo style_2={true} />
      <main className="container py-5" style={{ minHeight: "60vh" }}>
        <div className="row justify-content-center">
          <div className="col-lg-7 col-md-9">
            <div className="border rounded-3 bg-white p-4 p-md-5">
              <h1 className="h3 mb-3">{t("accountDeletion.title")}</h1>
              <p>{t("accountDeletion.explanation")}</p>
              <p className="small text-muted">{t("accountDeletion.retention")}</p>

              {message && <p role="status" className="alert alert-success">{message}</p>}
              {error && <p role="alert" className="alert alert-danger">{error}</p>}

              {token ? (
                <div className="d-grid gap-3">
                  <p>{t("accountDeletion.confirmPrompt")}</p>
                  <button type="button" className="tp-btn" disabled={busy} onClick={confirm}>
                    {busy ? t("accountDeletion.processing") : t("accountDeletion.confirm")}
                  </button>
                </div>
              ) : !message ? (
                <form onSubmit={submit} className="d-grid gap-3">
                  <label htmlFor="deletion-email">{t("accountDeletion.emailLabel")}</label>
                  <input
                    id="deletion-email"
                    className="form-control"
                    type="email"
                    autoComplete="email"
                    required
                    maxLength={254}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                  <button type="submit" className="tp-btn" disabled={busy}>
                    {busy ? t("accountDeletion.processing") : t("accountDeletion.request")}
                  </button>
                </form>
              ) : null}

              <p className="mt-4 mb-0"><Link href="/contact">{t("accountDeletion.contact")}</Link></p>
            </div>
          </div>
        </div>
      </main>
      <Footer primary_style={true} />
    </>
  );
}
