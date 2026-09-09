import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  CreateVersionArgs,
  DeleteVersionArgs,
  UpdateVersionArgs,
  UpdateVersionResponse,
  VersionListResponse,
} from '../../entities';

export const fetchVersionList = async () => {
  const response = await fetchDataAsync<VersionListResponse>(
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
    const response = await fetchDataAsync<VersionListResponse>(
      ROUTE_API.applicationVersion,
      {
        method: 'POST',
        data: payload,
      }
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

  const response = await fetchDataAsync<UpdateVersionResponse>(
    ROUTE_API.applicationVersion,
    {
      method: 'PUT',
      data: payload,
    }
  );
  return response?.data;
};

export const fetchCurrentVersion = async () => {
  const response = await fetchDataAsync<VersionListResponse>(
    ROUTE_API.applicationVersionActive
  );
  return response;
};

export const deleteVersion = async (args: DeleteVersionArgs) => {
  const payload = { uuid: args.uuid };
  const response = await fetchDataAsync<VersionListResponse>(
    ROUTE_API.applicationVersion,
    {
      method: 'DELETE',
      data: payload,
    }
  );
  return response?.data;
};
