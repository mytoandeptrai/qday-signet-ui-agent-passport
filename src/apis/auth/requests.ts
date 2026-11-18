import { requestLoginCode, verifyLoginCode } from '@/mock/api';
import type { RequestLoginCodeParams, VerifyLoginCodeParams } from './types';

export const requestCode = ({ email }: RequestLoginCodeParams) => requestLoginCode(email);

export const verifyCode = ({ email, code }: VerifyLoginCodeParams) => verifyLoginCode(email, code);
