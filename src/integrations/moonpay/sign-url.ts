import { moonPayConfig } from './config';

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${moonPayConfig.serverUrl}${path}`);
  if (!res.ok) throw new Error(`MoonPay server ${path} failed with status ${res.status}`);
  return (await res.json()) as T;
}

// IP matching: the server hashes the customer's public IP with the secret key. The widget sends it
// as allowedIpAddress, which is then part of the signed URL.
export async function requestIpHash(): Promise<string> {
  const { allowedIpAddress } = await getJson<{ allowedIpAddress?: string }>('/ip-hash');
  if (!allowedIpAddress) throw new Error('MoonPay server returned no IP hash');
  return allowedIpAddress;
}

// The secret key lives on the server: it signs the widget URL and returns the raw base64 signature.
// The SDK URL-encodes the signature itself, so it is returned as is.
export async function requestSignature(url: string): Promise<string> {
  const { signature } = await getJson<{ signature?: string }>(`/sign-url?url=${encodeURIComponent(url)}`);
  if (!signature) throw new Error('MoonPay signing returned no signature');
  return signature;
}
