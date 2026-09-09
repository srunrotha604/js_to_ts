export interface VersionItem {
  uuid: string;
  version: string;
  releaseDate: string;
  description: string;
}

export interface VersionListResponse {
  status?: number;
  data?: {
    list: VersionItem[];
  };
  list?: VersionItem[];
  version?: string;
}

export interface CreateVersionArgs {
  releaseDate: string;
  version: string;
  description: string;
}

export interface UpdateVersionArgs extends CreateVersionArgs {
  uuid: string;
}

export interface DeleteVersionArgs {
  uuid: string;
}

export interface UpdateVersionResponse {
  message?: string;
  data?: Partial<VersionItem>;
}
