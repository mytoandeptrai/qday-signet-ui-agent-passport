import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { cn } from '@/lib/utils';
import type { WalletToken, WalletTokenId } from '../../hooks';

interface WalletTokensUiProps {
  tokens: WalletToken[];
  selected: WalletTokenId;
  hidden: boolean;
  onSelect: (id: WalletTokenId) => void;
}

const WalletTokensUi = ({ tokens, selected, hidden, onSelect }: WalletTokensUiProps) => {
  const { t } = useTranslation('wallet-page');
  return (
    <section className='mt-8'>
      <h2 className='text-body font-medium'>{t('tokens.title')}</h2>
      <div role='radiogroup' aria-label={t('tokens.title')} className='mt-3 flex flex-col gap-2'>
        {tokens.map((token) => (
          <Button
            key={token.id}
            type='button'
            role='radio'
            aria-checked={selected === token.id}
            variant='outline'
            onClick={() => onSelect(token.id)}
            className={cn('h-auto justify-start gap-3 rounded-md px-4 py-3 text-left font-normal', selected === token.id && 'border-primary bg-primary/5')}
          >
            <span aria-hidden className='grid size-9 shrink-0 place-items-center rounded-full bg-muted font-display text-body font-semibold'>
              {token.symbol.charAt(0)}
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block text-body font-medium'>{token.symbol}</span>
              <span className='block text-small text-muted-foreground'>{t(`tokens.${token.id}`)}</span>
            </span>
            <span className='font-display text-body tabular-nums'>{hidden ? '••••' : token.amount}</span>
          </Button>
        ))}
      </div>
    </section>
  );
};

export default WalletTokensUi;
