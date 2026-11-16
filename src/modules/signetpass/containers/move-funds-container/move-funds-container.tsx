import { FormWrapper } from '@/components/ui/form';
import { MoveFundsNeedsSignetpassUi, MoveFundsUi } from '../../components';
import { useMoveFundsContainer } from '../../hooks';

const MoveFundsContainer = () => {
  const { t, created, active, passName, network, mainBalance, form, amount, status, summary, isLoading, onCreateSignetPass, onActivateSignetPass, onSubmit } = useMoveFundsContainer();

  if (!created) {
    return <MoveFundsNeedsSignetpassUi message={t('move-funds.needs-signetpass')} actionLabel={t('move-funds.create-first')} onAction={onCreateSignetPass} />;
  }
  if (!active) {
    return <MoveFundsNeedsSignetpassUi message={t('move-funds.needs-activation')} actionLabel={t('move-funds.activate')} onAction={onActivateSignetPass} />;
  }

  return (
    <FormWrapper form={form} onSubmit={onSubmit}>
      <MoveFundsUi passName={passName} network={network} mainBalance={mainBalance} amount={amount} status={status} summary={summary} isLoading={isLoading} />
    </FormWrapper>
  );
};

export default MoveFundsContainer;
