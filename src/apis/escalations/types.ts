import type { Escalation } from '@/types/passport';

export type { Escalation };

export interface DecideEscalationParams {
  id: string;
  approve: boolean;
}
