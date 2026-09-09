import { fetchDataAsync } from '../../../../services/$service';
import { ROUTE_API } from '../../../../utils/route-util';

export const submitContactUs = (data: { phone: string; message: string }) =>
  fetchDataAsync(ROUTE_API.logContactUs, { method: 'POST', data });
