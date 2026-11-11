import { PageHeader } from '@/components/app/page-header';
import { FormWrapper } from '@/components/ui/form';
import { CreateSessionFormUi } from '../../components';
import { useCreateSessionContainer } from '../../hooks';

const CreateSessionContainer = () => {
  const { t, form, available, isLoading, onSubmit } = useCreateSessionContainer();
  return (
    <div className='max-w-xl'>
      <PageHeader title={t('title')} description={t('description')} />
      <FormWrapper form={form} onSubmit={onSubmit}>
        <CreateSessionFormUi available={available} isLoading={isLoading} />
      </FormWrapper>
    </div>
  );
};

export default CreateSessionContainer;
