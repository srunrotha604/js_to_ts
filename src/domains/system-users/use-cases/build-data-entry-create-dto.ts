export interface BuildDataEntryCreateDtoInput {
  email: string;
  givenName: string;
  sureName: string;
  role: string;
  phone: string;
}

export const buildDataEntryCreateDto = ({
  email,
  givenName,
  sureName,
  role,
  phone,
}: BuildDataEntryCreateDtoInput) => ({
  email,
  givenName,
  sureName,
  role,
  phone,
});
