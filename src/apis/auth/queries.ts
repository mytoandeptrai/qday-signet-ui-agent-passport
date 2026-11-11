import { useMutation } from '@tanstack/react-query';
import { KEYS } from './keys';
import { passkeyCreate, passkeySignIn, requestCode, verifyCode } from './requests';
import type { RequestLoginCodeParams, VerifyLoginCodeParams } from './types';

export const useRequestLoginCodeMutation = () =>
  useMutation({
    mutationKey: [KEYS.LOGIN_CODE],
    mutationFn: (data: RequestLoginCodeParams) => requestCode(data),
  });

export const useVerifyLoginCodeMutation = () =>
  useMutation({
    mutationKey: [KEYS.LOGIN_VERIFY],
    mutationFn: (data: VerifyLoginCodeParams) => verifyCode(data),
  });

export const usePasskeySignInMutation = () =>
  useMutation({ mutationKey: [KEYS.PASSKEY_SIGN_IN], mutationFn: passkeySignIn });

export const usePasskeyCreateMutation = () =>
  useMutation({ mutationKey: [KEYS.PASSKEY_CREATE], mutationFn: passkeyCreate });
