import { useCompleteOnboardingMutation } from '@/apis/account';
import { INSTALL_PROMPT } from '@/mock/landing';
import { useState } from 'react';

const WINDOWS_PROMPT = INSTALL_PROMPT.replace('curl -fsSL https://signet.example/install.sh | bash', 'irm https://signet.example/install.ps1 | iex');

/** The command that installs Signet in an agent's terminal, for macOS/Linux or Windows. Copying it counts as connecting the agent. */
export const useInstallPrompt = () => {
  const completeOnboarding = useCompleteOnboardingMutation();
  const [windows, setWindows] = useState(false);
  const prompt = windows ? WINDOWS_PROMPT : INSTALL_PROMPT;

  const copyPrompt = () => {
    navigator.clipboard?.writeText(prompt).catch(() => undefined);
    completeOnboarding.mutate('connected');
  };

  return { prompt, windows, onToggleWindows: () => setWindows((w) => !w), copyPrompt };
};
