import { fetchData } from '../services/$service';
import { ROUTE_API } from '../utils/route-util';
export const fetchProject = async () => {
  try {
    const res = await fetchData(ROUTE_API.operationCustomerProduct, {}, 'GET');
    return res;
  } catch (error) {
    console.error('Error fetching project:', error);
  }
};
