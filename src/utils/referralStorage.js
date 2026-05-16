export const PENDING_REFERRAL_STORAGE_KEY = "snu_pending_referral_code";

export function getPendingReferralCode() {
  if (typeof window === "undefined") return "";
  try {
    return (sessionStorage.getItem(PENDING_REFERRAL_STORAGE_KEY) || "").trim();
  } catch {
    return "";
  }
}

export function setPendingReferralCode(value) {
  if (typeof window === "undefined") return;
  const v = (value || "").trim();
  try {
    if (v) sessionStorage.setItem(PENDING_REFERRAL_STORAGE_KEY, v);
    else sessionStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function clearPendingReferralCode() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PENDING_REFERRAL_STORAGE_KEY);
  } catch {
    // ignore
  }
}
