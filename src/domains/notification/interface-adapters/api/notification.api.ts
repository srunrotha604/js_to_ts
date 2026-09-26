import { HttpUtil } from '../../../../utils/http-util';
import { ROUTE_API } from '../../../../utils/route-util';
import type {
  NotificationListResponse,
  UnreadCountResponse,
} from '../../entities';

export const fetchNotifications = async (
  pageSize = 20
): Promise<NotificationListResponse | null> => {
  const res = await HttpUtil.get<NotificationListResponse>(
    ROUTE_API.notifications,
    { params: { pageNumber: 1, pageSize } }
  );
  if (!res || res.status !== 200) return null;
  return res.data;
};

export const markNotificationRead = async (
  id: number
): Promise<UnreadCountResponse | null> => {
  const res = await HttpUtil.post<UnreadCountResponse>(
    ROUTE_API.notificationRead(id)
  );
  if (!res || res.status !== 200) return null;
  return res.data;
};

export const markAllNotificationsRead =
  async (): Promise<UnreadCountResponse | null> => {
    const res = await HttpUtil.post<UnreadCountResponse>(
      ROUTE_API.notificationReadAll
    );
    if (!res || res.status !== 200) return null;
    return res.data;
  };

export const createNotificationStreamTicket = async (): Promise<
  string | null
> => {
  const res = await HttpUtil.post<{ ticket: string }>(
    ROUTE_API.notificationStreamTicket
  );
  if (!res || res.status !== 200) return null;
  return res.data.ticket || null;
};
