import { ArrowLeftIcon, PencilIcon } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { FormWrapper } from '@/components/ui/form';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/ui/page-header';
import { ROUTES } from '@/constant';
import { RenameSignetpassUi, SignetpassBalanceUi, SignetpassInstallUi, SignetpassNextUi, SignetpassNotFoundUi } from '../../components';
import { useSignetpassDetailsContainer } from '../../hooks';

const SignetpassDetailsContainer = () => {
  const {
    t,
    pass,
    isLoading,
    network,
    install,
    renaming,
    form,
    isRenaming,
    onCopyInstall,
    onOpenRename,
    onCloseRename,
    onRename,
    onAddFunds,
    onActivate,
    onCreateSession,
  } = useSignetpassDetailsContainer();

  if (isLoading) return null;
  if (!pass) return <SignetpassNotFoundUi />;

  return (
    <div className='max-w-3xl'>
      <Button variant='ghost' size='sm' asChild className='-ml-3 mb-3 text-muted-foreground'>
        <Link to={ROUTES.WALLET}>
          <ArrowLeftIcon /> {t('details.back')}
        </Link>
      </Button>
      <PageHeader
        title={pass.name}
        description={`${network.name} · ${network.token.symbol}`}
        action={
          <Button variant='outline' size='sm' onClick={onOpenRename}>
            <PencilIcon /> {t('details.rename.action')}
          </Button>
        }
      />
      <SignetpassBalanceUi pass={pass} network={network} onAddFunds={onAddFunds} onActivate={onActivate} />
      <SignetpassInstallUi
        prompt={install.prompt}
        windows={install.windows}
        hasCode={install.hasCode}
        canGetCode={install.canGetCode}
        isGettingCode={install.isGettingCode}
        onGetCode={install.onGetCode}
        onCopy={onCopyInstall}
        onToggleWindows={install.onToggleWindows}
      />
      <SignetpassNextUi canCreateSession={pass.status === 'active'} onCreateSession={onCreateSession} />
      <Modal isOpen={renaming} title={t('details.rename.title')} description={t('details.rename.description')} onClose={onCloseRename}>
        <FormWrapper form={form} onSubmit={onRename}>
          <RenameSignetpassUi isLoading={isRenaming} />
        </FormWrapper>
      </Modal>
    </div>
  );
};

export default SignetpassDetailsContainer;
