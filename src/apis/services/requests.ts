import { listServices } from '@/mock/api';
import type { GetServiceListParams } from './types';

export const getServiceList = (params: GetServiceListParams) => listServices(params);
