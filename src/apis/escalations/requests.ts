import { forSelectedPass, mockRequest } from '../mock-transport';
import type { DecideEscalationParams } from './types';

export const getEscalationList = () => mockRequest((s) => forSelectedPass(s, s.escalations));
export const decideEscalation = ({ id, approve }: DecideEscalationParams) =>
  mockRequest((s) => s.decideEscalation(id, approve));
