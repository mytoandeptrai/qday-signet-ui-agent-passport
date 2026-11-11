/** Simulated network latency for mock requests (800–1500ms). */
export const mockDelay = (min = 800, max = 1500) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
