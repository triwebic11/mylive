export const calculateProductAmounts = (product, products) => {
  const matchedProduct = products?.find(
    (p) => p.productId?.toString() === product.productId?.toString()
  );

  const quantity = Number(product.quantity || 0);
  const rate = Number(product.productRate || 0);

  const subtotal = rate * quantity;

  let freeSubtotal = 0;

  if (matchedProduct?.rfp && subtotal < 5000) {
    freeSubtotal = (matchedProduct.rfp * subtotal) / 100;
  } else if (subtotal >= 5000 && matchedProduct?.acfp) {
    freeSubtotal =
      ((matchedProduct.acfp + (matchedProduct.rfp || 0)) * subtotal) / 100;
  }

  return {
    subtotal,
    freeSubtotal,
    subPoint: quantity * Number(product.pointValue || 0),
    subDiscount: quantity * (matchedProduct?.discount || 0),
  };
};
