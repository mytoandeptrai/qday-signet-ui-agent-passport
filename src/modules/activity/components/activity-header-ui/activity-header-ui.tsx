import { PageHeader } from '@/components/app/page-header';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/integrations/i18n';
import { Download } from 'lucide-react';

type ActivityHeaderUiProps = {
  onExportCsv: () => void;
};

const ActivityHeaderUi = ({ onExportCsv }: ActivityHeaderUiProps) => {
  const { t } = useTranslation('activity-page');
  return (
    <PageHeader
      title={t('title')}
      action={
        <Button variant='outline' onClick={onExportCsv}>
          <Download /> {t('labels.export-csv')}
        </Button>
      }
    />
  );
};

export default ActivityHeaderUi;
