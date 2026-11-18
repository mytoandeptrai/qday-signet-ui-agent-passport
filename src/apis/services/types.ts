import type { Service } from '@/types/passport';

export type { Service };

export interface CallServiceParams {
  serviceId: string;
  passId: string;
}

export interface ServiceCallResult {
  status: number;
  body: string;
}
export type { ServiceQuery as GetServiceListParams } from '@/mock/api';
