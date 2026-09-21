export const buildProjectEditDto = (
  transationCode: string | undefined,
  projectName: string
) => ({
  transationCode,
  projectName,
});
