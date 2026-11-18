import SignStatusUi from '@/components/ui/sign-status';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from '@/integrations/i18n';
import type { SignStatus } from '@/integrations/wallet';
import { money } from '@/lib/format';
import { type CheckoutProblem, SAMPLE_SHIP_TO, type SessionProblem } from '../../utils';

export interface CheckoutAgent {
  name: string;
  /** The task of the agent's open spending session, when it has one. */
  task?: string;
  /** What that session has left to spend. */
  left?: number;
  /** The most that session lets one payment spend. */
  perCall?: number;
}

interface ShopCheckoutUiProps {
  items: number;
  shops: number;
  total: string;
  token: string;
  passReady: boolean;
  agents: CheckoutAgent[];
  selectedAgent?: string;
  sessionIssue: SessionProblem | null;
  left: number;
  perCall: number;
  proposal: { limit: number; perCall: number; hours: number };
  problem: CheckoutProblem | null;
  status: SignStatus;
  summary?: string;
  isLoading: boolean;
  canPay: boolean;
  onSelectAgent: (name: string) => void;
  onCreateSession: () => void;
  onRegisterAgent: () => void;
  onPay: () => void;
}

const ShopCheckoutUi = ({
  items,
  shops,
  total,
  token,
  passReady,
  agents,
  selectedAgent,
  sessionIssue,
  left,
  perCall,
  proposal,
  problem,
  status,
  summary,
  isLoading,
  canPay,
  onSelectAgent,
  onCreateSession,
  onRegisterAgent,
  onPay,
}: ShopCheckoutUiProps) => {
  const { t } = useTranslation('shopping-page');
  return (
    <div className='flex flex-col gap-4'>
      <p className='text-small text-muted-foreground'>
        {t('checkout.items', { count: items })} · {t('checkout.shops', { count: shops })}
      </p>
      <dl className='divide-y border text-body'>
        <div className='flex items-center justify-between px-4 py-3'>
          <dt className='text-muted-foreground'>{t('checkout.total')}</dt>
          <dd className='font-medium tabular-nums'>
            {total} {token}
          </dd>
        </div>
        <div className='flex items-center justify-between gap-3 px-4 py-3'>
          <dt className='text-muted-foreground'>{t('checkout.ship-to')}</dt>
          <dd className='text-right'>{SAMPLE_SHIP_TO}</dd>
        </div>
      </dl>
      <fieldset disabled={isLoading} className='min-w-0'>
        <legend className='mb-2 text-body font-medium'>{t('checkout.pay-from')}</legend>
        {!passReady ? (
          <p className='text-body text-muted-foreground'>{t('checkout.no-pass')}</p>
        ) : agents.length === 0 ? (
          <div className='flex flex-col items-start gap-2'>
            <p className='text-body text-muted-foreground'>{t('checkout.no-agent')}</p>
            <Button type='button' variant='outline' size='sm' onClick={onRegisterAgent}>
              {t('checkout.register-agent')}
            </Button>
          </div>
        ) : (
          <RadioGroup value={selectedAgent} onValueChange={onSelectAgent} className='gap-2'>
            {agents.map((a) => (
              <Label key={a.name} htmlFor={`pay-${a.name}`} className='flex cursor-pointer items-center gap-3 border px-4 py-3 font-normal'>
                <RadioGroupItem id={`pay-${a.name}`} value={a.name} />
                <span className='min-w-0 flex-1'>
                  <span className='block truncate font-medium'>{a.name}</span>
                  <span className='block truncate text-small text-muted-foreground'>{a.task ?? t('checkout.agent-no-session')}</span>
                </span>
                {a.left !== undefined && a.perCall !== undefined && (
                  <span className='text-right tabular-nums'>
                    <span className='block'>{t('checkout.agent-left', { left: money(a.left), token })}</span>
                    <span className='block text-small text-muted-foreground'>{t('checkout.agent-per-call', { max: money(a.perCall), token })}</span>
                  </span>
                )}
              </Label>
            ))}
          </RadioGroup>
        )}
      </fieldset>
      {passReady && selectedAgent && sessionIssue && (
        <div role='status' className='flex flex-col items-start gap-2 border px-4 py-3 text-body'>
          <p className='font-medium'>
            {sessionIssue === 'budget'
              ? t('checkout.session.low-budget', { left: money(left), token })
              : sessionIssue === 'per-call'
                ? t('checkout.session.low-per-call', { max: money(perCall), token })
                : t('checkout.session.none')}
          </p>
          <p className='text-muted-foreground'>
            {t('checkout.session.proposal', { limit: money(proposal.limit), perCall: money(proposal.perCall), hours: proposal.hours, token })}
          </p>
          <Button type='button' size='sm' onClick={onCreateSession}>
            {t('checkout.session.create')}
          </Button>
        </div>
      )}
      {problem && (
        <p role='alert' className='text-small text-destructive'>
          {t(`checkout.problems.${problem.code}`, {
            name: 'name' in problem ? problem.name : '',
            max: 'max' in problem ? problem.max : 0,
            token,
          })}
        </p>
      )}
      <SignStatusUi status={status} summary={summary} />
      <Button type='button' disabled={isLoading || !canPay} onClick={onPay}>
        {isLoading ? t('checkout.paying') : t('checkout.submit', { total, token })}
      </Button>
    </div>
  );
};

export default ShopCheckoutUi;
