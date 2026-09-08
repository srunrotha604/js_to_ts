export interface MenuItem {
  code: string;
  active?: boolean;
  [key: string]: unknown;
}

export interface ModuleActionItem {
  code: string;
  active?: boolean;
  [key: string]: unknown;
}

export interface ModuleGroupItem {
  code: string;
  action?: ModuleActionItem[];
  [key: string]: unknown;
}

export interface AuthModuleState {
  mainMenu?: MenuItem[];
  menu?: MenuItem[];
  module?: ModuleGroupItem[];
}

export interface ModuleContextValue {
  hasMainMenuPermission: (code: string) => boolean;
  hasMenuPermission: (code: string) => boolean;
  hasModulePermission: (execution: string, feature: string) => boolean;
}
