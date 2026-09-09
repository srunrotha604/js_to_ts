export const buildUserRoleCreateDto = (
  applicationFamily: string,
  roleFamily: string,
  userCode: string | undefined
) => ({
  applicationFamily,
  roleFamily,
  userCode,
});
