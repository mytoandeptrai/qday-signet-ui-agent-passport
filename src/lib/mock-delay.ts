export const mockDelay = (min = 800, max = 1500) =>
  new Promise<void>((resolve) => setTimeout(resolve, min + Math.random() * (max - min)));
