import { useMutation } from '@tanstack/react-query';
import { KEYS } from './keys';
import { requestCode, verifyCode } from './requests';
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
