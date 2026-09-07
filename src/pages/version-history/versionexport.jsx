import { fetchDataAsync } from '../../services/$service';

export const getVersionList = async () => {
  const response = await fetchDataAsync('/application-version');
  return response.data;
};

export const createNewVersion = async (args) => {
  const payload = {
    releaseDate: args.releaseDate,
    version: args.version,
    description: args.description,
  };

  try {
    const response = await fetchDataAsync('/application-version', {
      method: 'POST',
      data: payload,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating new version:', error);
    throw error;
  }
};

export const updateVersion = async (args) => {
  const payload = {
    releaseDate: args.releaseDate,
    version: args.version,
    description: args.description,
    uuid: args.uuid,
  };

  const response = await fetchDataAsync('/application-version', {
    method: 'PUT',
    data: payload,
  });
  return response.data;
};

export const getCurrentVersion = async () => {
  const response = await fetchDataAsync('/application-version/active');
  return response;
};

export const deleteVersion = async (args) => {
  const payload = { uuid: args.uuid };
  const response = await fetchDataAsync('/application-version', {
    method: 'DELETE',
    data: payload,
  });
  return response.data;
};




