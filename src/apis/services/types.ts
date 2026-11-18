import type { Service } from '@/types/passport';

export type { Service };

export interface CallServiceParams {
  serviceId: string;
  /** The SignetPass the call is made for; the backend knows the rest. */
  passId: string;
}

export interface ServiceCallResult {
  status: number;
  body: string;
}
export type { ServiceQuery as GetServiceListParams } from '@/mock/api';
