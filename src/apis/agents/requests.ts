import { mockDelay } from '@/lib/mock-delay';
import { mockRequest } from '../mock-transport';
import type { AgentIdParams } from './types';

export const getAgentList = () => mockRequest((s) => s.agents);
export const getSecurityLog = () => mockRequest((s) => s.securityLog);

export const approveAgent = async ({ id }: AgentIdParams) => {
  await mockDelay();
  return mockRequest((s) => s.approveAgent(id));
};

export const revokeAgent = async ({ id }: AgentIdParams) => {
  await mockDelay();
  return mockRequest((s) => s.revokeAgent(id));
};
