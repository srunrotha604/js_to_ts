import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  CreateVersionArgs,
  DeleteVersionArgs,
  UpdateVersionArgs,
  UpdateVersionResponse,
  VersionListResponse,
} from '../../entities';

export const fetchVersionList = async () => {
  const response = await HttpUtil.get<VersionListResponse>(
    ROUTE_API.applicationVersion
  );
  return response?.data;
};

export const createVersion = async (args: CreateVersionArgs) => {
  const payload = {
    releaseDate: args.releaseDate,
    version: args.version,
    description: args.description,
  };

  try {
    const response = await HttpUtil.post<VersionListResponse>(
      ROUTE_API.applicationVersion,
      payload
    );

    return response?.data;
  } catch (error) {
    console.error('Error creating new version:', error);
    throw error;
  }
};

export const updateVersion = async (args: UpdateVersionArgs) => {
  const payload = {
    releaseDate: args.releaseDate,
    version: args.version,
    description: args.description,
    uuid: args.uuid,
  };

  const response = await HttpUtil.put<UpdateVersionResponse>(
    ROUTE_API.applicationVersion,
    payload
  );
  return response?.data;
};

export const fetchCurrentVersion = async () => {
  const response = await HttpUtil.get<VersionListResponse>(
    ROUTE_API.applicationVersionActive
  );
  return response;
};

export const deleteVersion = async (args: DeleteVersionArgs) => {
  const payload = { uuid: args.uuid };
  const response = await HttpUtil.delete<VersionListResponse>(
    ROUTE_API.applicationVersion,
    payload
  );
  return response?.data;
};
