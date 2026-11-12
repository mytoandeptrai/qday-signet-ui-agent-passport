import { forSelectedPass, mockRequest } from '../mock-transport';
import type { CreateSessionInput, RevokeSessionParams } from './types';

export const getSessionList = () => mockRequest((s) => forSelectedPass(s, s.sessions));
export const getSession = (id: string) => mockRequest((s) => forSelectedPass(s, s.sessions).find((x) => x.id === id) ?? null);
export const createSession = (input: CreateSessionInput) => mockRequest((s) => s.createSession(input));
export const revokeSession = ({ id }: RevokeSessionParams) => mockRequest((s) => s.revokeSession(id));
