import { LegalDocumentUi } from '../../components';
import { useTermsContainer } from '../../hooks';

const TermsContainer = () => {
  const legal = useTermsContainer();
  return (
    <div className='mx-auto w-full max-w-[720px]'>
      <LegalDocumentUi {...legal} />
    </div>
  );
};

export default TermsContainer;
