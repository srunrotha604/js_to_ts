export interface BuildBranchCreateDtoInput {
  branchCode: string;
  branchName: string;
  contacts: string;
  phone: string;
  mobileOne: string;
  mobileTwo: string;
  email: string;
  website: string;
  address: string;
}

export const buildBranchCreateDto = ({
  branchCode,
  branchName,
  contacts,
  phone,
  mobileOne,
  mobileTwo,
  email,
  website,
  address,
}: BuildBranchCreateDtoInput) => ({
  branchCode,
  branchName,
  contacts,
  phone,
  mobileOne,
  mobileTwo,
  email,
  website,
  address,
});
