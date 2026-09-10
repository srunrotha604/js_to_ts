import { ROUTE_API } from '../../../utils/route-util';
import { createStreamTicket } from './api/login.api';

const RECONNECT_DELAY_MS = 2000;

export function openSessionStream(onForcedLogout: () => void): () => void {
  let source: EventSource | null = null;
  let closedIntentionally = false;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  const connect = async () => {
    if (closedIntentionally) return;

    let ticket: string;
    try {
      const res = await createStreamTicket();
      ticket = res?.data.ticket || '';
    } catch {
      return;
    }

    if (closedIntentionally) return;

    source = new EventSource(
      `${ROUTE_API.root}${ROUTE_API.sessionStream}?ticket=${ticket}`
    );

    source.onmessage = (event: MessageEvent<string>) => {
      try {
        const data = JSON.parse(event.data) as { reason?: string };
        if (data.reason === 'new-login') {
          closedIntentionally = true;
          source?.close();
          onForcedLogout();
        }
      } catch {
        // ignore malformed payloads
      }
    };

    source.onerror = () => {
      source?.close();
      source = null;
      if (closedIntentionally) return;
      reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS);
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
