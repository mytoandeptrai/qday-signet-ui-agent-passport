import { PublicLayout } from '@/components/layouts';
import { LegalDocumentUi } from '../../components';
import { useTermsContainer } from '../../hooks';

const TermsContainer = () => {
  const legal = useTermsContainer();
  return (
    <PublicLayout className='max-w-[720px]'>
      <LegalDocumentUi {...legal} />
    </PublicLayout>
  );
};

export default TermsContainer;
