'use client';
import { useEffect, useReducer } from "react";
import { getActiveDiscount } from "@/utils/product-discount";

export default function useActiveDiscount(product) {
  const [, refresh] = useReducer((value) => value + 1, 0);
  const endDate = product.offerDate?.endDate;
  const discount = getActiveDiscount(product);

  useEffect(() => {
    if (!endDate || !discount) return;
    const expires = new Date(endDate).getTime();
    let timer;
    function schedule() {
      const remaining = expires - Date.now();
      if (remaining <= 0) refresh();
      else timer = setTimeout(schedule, Math.min(remaining, 2147483647));
    }
    schedule();
    return () => clearTimeout(timer);
  }, [endDate, discount]);

  return discount;
}
