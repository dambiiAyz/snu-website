export function getActiveDiscount(product, now = Date.now()) {
  const endDate = product.offerDate?.endDate;
  if (endDate && !(new Date(endDate).getTime() > now)) return 0;
  return Number(product.discount) || 0;
}
