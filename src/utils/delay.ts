type DelayCallback = (() => void) | (() => void)[];

export const delay = (callback: DelayCallback, timeout: number = 200): void => {
  if (Array.isArray(callback)) {
    if (callback.length === 0) {
      return;
    }
    const [first, ...rest] = callback;
    setTimeout(() => {
      first();
      delay(rest, timeout);
    }, timeout);
    return;
  }
  setTimeout(callback, timeout);
};
