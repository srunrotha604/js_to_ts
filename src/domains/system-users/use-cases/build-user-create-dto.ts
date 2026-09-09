export interface BuildUserCreateDtoInput {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  branch: string;
  phone: string;
}

export const buildUserCreateDto = ({
  email,
  givenName,
  sureName,
  role,
  branch,
  phone,
}: BuildUserCreateDtoInput) => ({
  email,
  givenName,
  sureName,
  role,
  branch,
  phone,
});
