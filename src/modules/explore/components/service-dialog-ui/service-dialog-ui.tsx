import { Link } from '@tanstack/react-router';
import type { Service } from '@/apis/services';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

type ServiceDialogUiProps = {
  service: Service | null;
  isSignedIn: boolean;
  onClose: () => void;
  onUse: () => void;
};

const ServiceDialogUi = ({ service, isSignedIn, onClose, onUse }: ServiceDialogUiProps) => {
  const { t } = useTranslation('explore-page');

  return (
    <Dialog open={Boolean(service)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service?.name}</DialogTitle>
          <DialogDescription>{service?.description}</DialogDescription>
        </DialogHeader>
        {service && (
          <dl className='grid grid-cols-[100px_1fr] gap-y-2 text-sm'>
            <dt className='text-muted-foreground'>{t('dialog.price')}</dt>
            <dd className='tabular-nums'>{service.priceLabel}</dd>
            <dt className='text-muted-foreground'>{t('dialog.category')}</dt>
            <dd>{service.category}</dd>
            <dt className='text-muted-foreground'>{t('dialog.provider')}</dt>
            <dd>{service.provider}</dd>
          </dl>
        )}
        <DialogFooter>
          {isSignedIn ? (
            <Button asChild onClick={onUse}>
              <Link to={ROUTES.OVERVIEW} search={{ dialog: 'create-session' }}>{t('dialog.use')}</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link to={ROUTES.LOGIN} search={{ redirect: ROUTES.EXPLORE }}>
                {t('dialog.sign-in')}
              </Link>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialogUi;
