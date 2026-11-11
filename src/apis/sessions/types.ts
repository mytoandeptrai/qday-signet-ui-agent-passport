import type { CreateSessionInput, SpendingSession } from '@/types/passport';

export type { CreateSessionInput, SpendingSession };

export interface RevokeSessionParams {
  id: string;
}
