import { STATUS } from '../entities';
export interface CustomerCreateFormData {
  sureName?: string;
  firstName?: string;
  telNo?: string;
  project?: { value?: string };
  gender?: string;
  dateOfBirth?: string;
  identifyNumber?: string;
  nation?: { nationality?: string };
  physicalCard?: boolean | string;
  policy?: { value?: string };
  status?: string;
  childrenId?: string;
  parentId?: string;
  openingDate?: string;
}
export interface BuildCustomerCreateDtoContext {
  productCode?: string;
}
export const buildCustomerCreateDto = (
  data: CustomerCreateFormData,
  context: BuildCustomerCreateDtoContext
) => ({
  sureName: data?.sureName,
  firstName: data?.firstName,
  telNo: data?.telNo,
  projectCode: data?.project?.value,
  gender: data?.gender,
  dateOfBirth: data?.dateOfBirth,
  nicPassport: data?.identifyNumber,
  nation: data?.nation?.nationality,
  physicalCard: data?.physicalCard?.toString(),
  policies: data?.policy?.value,
  productCode: context.productCode,
  status: data.status || STATUS.Submitted,
  customerId: data?.childrenId,
  parentId: data?.parentId,
  openingDate: data?.openingDate,
});
