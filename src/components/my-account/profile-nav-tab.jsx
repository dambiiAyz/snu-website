'use client';

import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { userLoggedOut } from "@/redux/features/auth/authSlice";

function SingleNav({ active = false, id, title, icon }) {
  return (
    <button
      className={`nav-link ${active ? "active" : ""}`}
      id={`nav-${id}-tab`}
      data-bs-toggle="tab"
      data-bs-target={`#nav-${id}`}
      type="button"
      role="tab"
      aria-controls={id}
      aria-selected={active ? "true" : "false"}
    >
      <span>
        <i className={icon}></i>
      </span>
      {title}
    </button>
  );
}

const ProfileNavTab = () => {
  const { t } = useTranslation("common");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push("/");
  };

  return (
    <nav>
      <div
        className="nav nav-tabs tp-tab-menu flex-column"
        id="profile-tab"
        role="tablist"
      >
        <SingleNav
          active={true}
          id="profile"
          title={t("profile.nav.profile")}
          icon="fa-regular fa-user-pen"
        />
        <SingleNav
          id="rewards"
          title={t("profile.nav.rewards")}
          icon="fa-regular fa-gift"
        />
        <SingleNav
          id="information"
          title={t("profile.nav.information")}
          icon="fa-regular fa-circle-info"
        />
        <SingleNav
          id="order"
          title={t("profile.nav.myOrders")}
          icon="fa-light fa-clipboard-list-check"
        />
        <SingleNav
          id="password"
          title={t("profile.nav.changePassword")}
          icon="fa-regular fa-lock"
        />
        <button
          type="button"
          className="nav-link tp-profile-logout-btn mt-20 w-100 text-start border-0 bg-transparent"
          onClick={handleLogout}
        >
          <span>
            <i className="fa-regular fa-right-from-bracket"></i>
          </span>
          {t("profile.nav.logout")}
        </button>
      </div>
    </nav>
  );
};

export default ProfileNavTab;
