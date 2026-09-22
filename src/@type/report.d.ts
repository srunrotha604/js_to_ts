export interface SelectOption {
  productCode: string;
  productName: string;
  hidden?: boolean;
}
export interface SelectOptionList {
  value: string;
  label: string;
}
export interface CompanyBranchOption extends SelectOption {
  branch?: SelectOption[];
  logo?: string;
}
