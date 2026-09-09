export const buildProductCreateDto = (
  selectedProduct: string,
  productCode: string,
  productName: string
) => ({
  productsequenceCode: selectedProduct,
  productCode,
  productName,
});
