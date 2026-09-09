export const buildProductEditDto = (
  transactionCode: string | undefined,
  productCode: string,
  productName: string
) => ({
  transactionCode,
  productCode,
  productName,
});
