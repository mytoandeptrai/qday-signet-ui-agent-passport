import { LoginContainer } from '@/modules/auth/login';
import { loginSearchSchema } from '@/modules/auth/login/hooks';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  validateSearch: loginSearchSchema,
  component: LoginContainer,
});
