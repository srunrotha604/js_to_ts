export const delay = (callback, timeout = 200) => {
  if (Array.isArray(callback)) {
    if (callback.length === 0) {
      return;
    }
    const [first, ...rest] = callback;
    setTimeout(() => {
      first();
      delay(rest, timeout);
    }, timeout);
  }
  setTimeout(callback, timeout);
};
