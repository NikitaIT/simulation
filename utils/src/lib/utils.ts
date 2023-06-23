/**
 * Reject if X msec expired or signal aborted
 * @example
 * 
      const ac = new AbortController();
      result = await Promise.race([
        timeout(timeoutMsec, ac.signal),
        fetch(args, { signal: ac.signal }),
      ]);
      ac.abort();
 * @param msec msec
 * @param signal AbortSignal
 * @returns Promise rejected after X msec or after abort signal
 */
export const timeout = (msec: number, signal?: AbortSignal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`Timeout of ${msec}ms reached`));
    }, msec);
    if (!signal) return;
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Timeout aborted'));
    });
  });

/**
 * Wait for X msec if not aborted
 * @example
 * 
      await delay(delayMsec);
 * @param msec msec
 * @param signal AbortSignal
 * @returns Promise resolved after X msec or reject after abort signal
 */
export const delay = (msec: number, signal?: AbortSignal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, msec);
    if (!signal) return;
    signal.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new Error('Delay aborted'));
    });
  });
