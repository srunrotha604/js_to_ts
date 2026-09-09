import { STATUS } from '../entities';

export interface CustomerEditFormData {
  transactionCode?: string;
  sureName?: string;
  firstName?: string;
  telNo?: string;
  position?: string;
  project?: { value?: string };
  gender?: string;
  dateOfBirth?: string;
  nicPassport?: string;
  nation?: { nationality?: string };
  physicalCard?: boolean | string;
  policy?: { value?: string };
  transactionNumber?: string;
  customerId?: string;
  parentId?: string;
  openingDate?: string;
}

export interface BuildCustomerEditDtoContext {
  productCode?: string;
  isDraft: boolean;
}

export const buildCustomerEditDto = (
  data: CustomerEditFormData,
  context: BuildCustomerEditDtoContext
) => ({
  transactionCode: data.transactionCode,
  sureName: data.sureName,
  firstName: data.firstName,
  telNo: data.telNo,
  position: data.position,
  projectCode: data.project?.value,
  gender: data.gender,
  dateOfBirth: data.dateOfBirth,
  nicPassport: data.nicPassport,
  nation: data.nation?.nationality,
  physicalCard: data.physicalCard?.toString(),
  policies: data.policy?.value,
  transactionNumber: data.transactionNumber,
  status: context.isDraft ? STATUS.Draft : STATUS.Submitted,
  productCode: context.productCode,
  customerId: data.customerId,
  parentId: data?.parentId,
  openingDate: data.openingDate,
});
