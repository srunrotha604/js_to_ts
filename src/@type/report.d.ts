export interface SelectOption {
  productCode: string;
  productName: string;
  hidden?: boolean;
}

export interface CompanyBranchOption extends SelectOption {
  branch?: SelectOption[];
  logo?: string;
}
