export interface SelectOption {
  label: string;
  value: string;
  hidden?: boolean;
}

export interface CompanyBranchOption extends SelectOption {
  branch?: SelectOption[];
  logo?: string;
}
