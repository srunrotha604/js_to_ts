export interface SelectOption {
  value: string;
  label: string;
  hidden?: boolean;
}
export interface SelectOptionList {
  value: string;
  label: string;
}
export interface ProductSelectOption {
  productCode: string;
  productName: string;
  hidden?: boolean;
}
export interface CompanyBranchOption extends SelectOption {
  branch?: SelectOption[];
  logo?: string;
}
