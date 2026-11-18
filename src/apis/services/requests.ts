import { mockDelay } from '@/lib/mock-delay';
import { listServices } from '@/mock/api';
import { SERVICES } from '@/mock/services';
import { visiblePasses } from '@/stores/passport-store';
import { mockRequest } from '../mock-transport';
import type { CallServiceParams, GetServiceListParams, ServiceCallResult } from './types';

export const getServiceList = (params: GetServiceListParams) => listServices(params);

export const callService = async ({ serviceId, passId }: CallServiceParams): Promise<ServiceCallResult> => {
  await mockDelay();
  return mockRequest((s) => {
    const service = SERVICES.find((x) => x.id === serviceId);
    if (!service) throw new Error('Service not found');
    if (visiblePasses(s).find((p) => p.id === passId)?.status !== 'active') throw new Error('SignetPass is not active');
    return {
      status: 200,
      body: JSON.stringify({ service: service.name, endpoint: service.endpoint, passId, result: 'ok', calledAt: new Date().toISOString() }, null, 2),
    };
  });
};
