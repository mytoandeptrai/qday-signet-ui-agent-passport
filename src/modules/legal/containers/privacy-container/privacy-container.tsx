import { PublicLayout } from '@/components/layouts';
import { LegalDocumentUi } from '../../components';
import { usePrivacyContainer } from '../../hooks';

const PrivacyContainer = () => {
  const legal = usePrivacyContainer();
  return (
    <PublicLayout className='max-w-[720px]'>
      <LegalDocumentUi {...legal} />
    </PublicLayout>
  );
};

export default PrivacyContainer;
