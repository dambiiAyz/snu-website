import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

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
  const order_items = orderData?.orders;
  return (
    <div className="profile__ticket table-responsive">
      {!order_items ||
        (order_items?.length === 0 && (
          <div
            style={{ height: "210px" }}
            className="d-flex align-items-center justify-content-center"
          >
            <div className="text-center">
              <i
                style={{ fontSize: "30px" }}
                className="fa-solid fa-cart-circle-xmark"
              ></i>
              <p>You Have no order Yet!</p>
            </div>
          </div>
        ))}
      {order_items && order_items?.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Order Id</th>
              <th scope="col">Order Time</th>
              <th scope="col">Status</th>
              <th scope="col">View</th>
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
                    Invoice
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
