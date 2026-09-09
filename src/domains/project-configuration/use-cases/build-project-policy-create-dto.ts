export const buildProjectPolicyCreateDto = (
  projectFamily: string | undefined,
  policyCode: string
) => ({
  projectFamily,
  policyCode,
});
