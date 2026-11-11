import { PageHeader } from '@/components/ui/page-header';
import { useTranslation } from '@/integrations/i18n';
import { PlaygroundChipsUi } from '../../components';
import { usePlaygroundContainer } from '../../hooks';
import ReplayContainer from '../replay-container';

const PlaygroundContainer = () => {
  const { t } = useTranslation('playground-page');
  const { scenarios, scenario, onSelectScenario } = usePlaygroundContainer();
  return (
    <>
      <PageHeader title={t('title')} description={t('description')} />
      <PlaygroundChipsUi scenarios={scenarios} activeId={scenario.id} onSelect={onSelectScenario} />
      <ReplayContainer key={scenario.id} scenario={scenario} />
    </>
  );
};

export default PlaygroundContainer;
