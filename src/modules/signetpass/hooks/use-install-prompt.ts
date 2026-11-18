import { useCompleteOnboardingMutation } from '@/apis/account';
import { useGetInstallCodeMutation } from '@/apis/signetpass';
import { INSTALL_CODE_PLACEHOLDER, installCommand, installPrompt } from '@/mock/landing';
import type { SignetPass } from '@/types/passport';
import { useState } from 'react';

export const useInstallPrompt = (pass?: SignetPass | null) => {
  const completeOnboarding = useCompleteOnboardingMutation();
  const getCode = useGetInstallCodeMutation();
  const [windows, setWindows] = useState(false);
  const [issued, setIssued] = useState<{ passId: string; code: string }>();

  // A code belongs to the pass it was issued for, so switching pass drops it.
  const code = issued?.passId === pass?.id ? issued?.code : undefined;
  const prompt = installPrompt(installCommand(code ?? INSTALL_CODE_PLACEHOLDER, windows));

  const onGetCode = async () => {
    if (!pass) return;
    const { code: next } = await getCode.mutateAsync({ passId: pass.id });
    setIssued({ passId: pass.id, code: next });
  };

  const copyPrompt = () => {
    navigator.clipboard?.writeText(prompt).catch(() => undefined);
    completeOnboarding.mutate('connected');
  };

  return {
    prompt,
    windows,
    hasCode: code !== undefined,
    canGetCode: pass?.status === 'active',
    isGettingCode: getCode.isPending,
    onToggleWindows: () => setWindows((w) => !w),
    onGetCode,
    copyPrompt,
  };
};
