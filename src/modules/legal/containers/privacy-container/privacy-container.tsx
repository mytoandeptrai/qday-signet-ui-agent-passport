import { LegalDocumentUi } from '../../components';
import { usePrivacyContainer } from '../../hooks';

const PrivacyContainer = () => {
  const legal = usePrivacyContainer();
  return (
    <div className='mx-auto w-full max-w-[720px]'>
      <LegalDocumentUi {...legal} />
    </div>
  );
};

export default PrivacyContainer;
