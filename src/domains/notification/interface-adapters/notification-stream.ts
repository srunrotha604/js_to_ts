import { ROUTE_API } from '../../../utils/route-util';
import type { NotificationItem } from '../entities';
import { createNotificationStreamTicket } from './api/notification.api';

const RECONNECT_DELAY_MS = 3000;

interface NotificationStreamHandlers {
  onNotification: (item: NotificationItem) => void;
  onConnected: () => void;
}

export function openNotificationStream({
  onNotification,
  onConnected,
}: NotificationStreamHandlers): () => void {
  let source: EventSource | null = null;
  let closedIntentionally = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const scheduleReconnect = () => {
    if (closedIntentionally) return;
    reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
  };

  const connect = async () => {
    if (closedIntentionally) return;
    let ticket: string | null = null;
    try {
      ticket = await createNotificationStreamTicket();
    } catch {
      ticket = null;
    }
    if (closedIntentionally) return;
    if (!ticket) {
      scheduleReconnect();
      return;
    }

    source = new EventSource(
      `${ROUTE_API.root}${ROUTE_API.notificationStream}?ticket=${ticket}`
    );
    source.onopen = () => onConnected();
    source.addEventListener('notification', (event) => {
      try {
        onNotification(JSON.parse((event as MessageEvent<string>).data));
      } catch {
        // ignore malformed payloads
      }
    });
    source.onerror = () => {
      source?.close();
      source = null;
      scheduleReconnect();
    };
  };

  void connect();

  return () => {
    closedIntentionally = true;
    if (reconnectTimer) clearTimeout(reconnectTimer);
    source?.close();
    source = null;
  };
}
