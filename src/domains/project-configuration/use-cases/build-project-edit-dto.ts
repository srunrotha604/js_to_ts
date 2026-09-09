export const buildProjectEditDto = (
  transactionCode: string | undefined,
  projectName: string
) => ({
  transactionCode,
  projectName,
});
