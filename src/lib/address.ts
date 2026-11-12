/** A random 20-byte hex address, standing in for a deployed SignetPass contract until the contracts are live. */
export const randomAddress = () =>
  `0x${Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => b.toString(16).padStart(2, '0')).join('')}`;
