'use client';

import { AlertCircle } from 'lucide-react';
import { Trans } from 'react-i18next';
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { env } from '@/constant/base.const';
import { i18n, useTranslation } from '@/integrations/i18n';

export default function ErrorFluid(props: { error: { info?: { error: string | object }; error?: string | object } }) {
  const { t } = useTranslation();
  const errorMessage = safeErrorToString(props.error?.info?.error) || safeErrorToString(props.error?.error);

  if (errorMessage) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='bg-destructive/10'>
            <AlertCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>{t('errors.fluid.title')}</EmptyTitle>
          <EmptyDescription>{errorMessage}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  if (props.error) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='bg-destructive/10'>
            <AlertCircle className='text-destructive' />
          </EmptyMedia>
          <EmptyTitle>{t('errors.fluid.title')}</EmptyTitle>
          <EmptyDescription>
            <Trans
              t={t}
              i18nKey='errors.fluid.contact-support'
              values={{ email: env.APP_SUPPORT_EMAIL }}
              components={[
                <a key='email' href={`mailto:${env.APP_SUPPORT_EMAIL}`}>
                  {env.APP_SUPPORT_EMAIL}
                </a>,
              ]}
            />
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return null;
}

const safeErrorToString = (error: string | object | undefined): string | null => {
  if (!error) return null;
  if (typeof error === 'string') return error;
  if (typeof error === 'object') {
    // Handle Zod validation errors with issues array
    if ('issues' in error && Array.isArray(error.issues)) {
      return error.issues.map((issue) => issue.message || i18n.t('errors.fluid.validation-error')).join(', ');
    }
    // For other objects, try to stringify safely
    try {
      return JSON.stringify(error);
    } catch {
      return i18n.t('errors.fluid.invalid-data-format');
    }
  }
  return String(error);
};
