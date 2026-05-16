
export const getDefaultVariant = (variants) => {
  return variants.find((variant) => variant.isDefault) || variants[0];
}