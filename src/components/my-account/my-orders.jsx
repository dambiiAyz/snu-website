'use client';

import dayjs from "dayjs";
import Link from "next/link";
import React from "react";
import { useTranslation } from "react-i18next";

function formatOrderStatus(status) {
  if (!status && status !== 0) return "";
  const s = String(status).trim();
  if (!s) return "";
  const lower = s.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function statusClass(status) {
  const key = String(status || "").toLowerCase();
  if (key === "pending") return "pending";
  if (key === "processing") return "hold";
  if (key === "delivered") return "done";
  if (key === "cancel" || key === "cancelled" || key === "canceled") return "pending";
  if (key === "refunded") return "hold";
  return "";
}

const MyOrders = ({ orderData }) => {
  const { t } = useTranslation("common");
  const order_items = orderData?.orders;
  const empty = !order_items || order_items.length === 0;

  return (
    <div className="profile__ticket table-responsive">
      {empty && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>{t("profile.orders.empty")}</p>
            </div>
          </div>
        )}
      {!empty && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">{t("profile.orders.columns.orderId")}</th>
              <th scope="col">{t("profile.orders.columns.time")}</th>
              <th scope="col">{t("profile.orders.columns.status")}</th>
              <th scope="col">{t("profile.orders.columns.view")}</th>
            </tr>
          </thead>
          <tbody>
            {order_items.map((item, i) => {
              const display = formatOrderStatus(item.status);
              const cls = statusClass(item.status);
              return (
              <tr key={i}>
                <th scope="row">#{item._id.substring(20, 25)}</th>
                <td data-info="title">
                  {dayjs(item.createdAt).format("MMMM D, YYYY")}
                </td>
                <td
                  data-info={`status ${cls}`}
                  className={`status ${cls}`}
                >
                  {display}
                </td>
                <td>
                  <Link href={`/order/${item._id}`} className="tp-logout-btn">
                    {t("profile.orders.invoice")}
                  </Link>
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyOrders;
