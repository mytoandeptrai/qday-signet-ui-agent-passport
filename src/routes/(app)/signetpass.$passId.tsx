import { SignetpassDetailsContainer } from '@/modules/signetpass';
import { createFileRoute } from '@tanstack/react-router';

// No beforeLoad check: the pass is only visible once MetaMask has reconnected, so the page shows its own "not found" state.
export const Route = createFileRoute('/(app)/signetpass/$passId')({
  component: SignetpassDetailsContainer,
});
