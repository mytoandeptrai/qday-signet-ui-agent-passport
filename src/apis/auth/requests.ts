import { createPasskey, requestLoginCode, signInWithPasskey, verifyLoginCode } from '@/mock/api';
import type { RequestLoginCodeParams, VerifyLoginCodeParams } from './types';

// Mock transport: swap these bodies for httpInstance calls when a backend exists.
export const requestCode = ({ email }: RequestLoginCodeParams) => requestLoginCode(email);

export const verifyCode = ({ email, code }: VerifyLoginCodeParams) => verifyLoginCode(email, code);

export const passkeySignIn = () => signInWithPasskey();

export const passkeyCreate = () => createPasskey();
