import { Link } from '@tanstack/react-router';
import type { Service } from '@/apis/services';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/ui/copy-button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ROUTES } from '@/constant';
import { useTranslation } from '@/integrations/i18n';

type ServiceDialogUiProps = {
  service: Service | null;
  detailsOpen: boolean;
  isSignedIn: boolean;
  onToggleDetails: () => void;
  onClose: () => void;
  onUse: () => void;
};

const ServiceDialogUi = ({ service, detailsOpen, isSignedIn, onToggleDetails, onClose, onUse }: ServiceDialogUiProps) => {
  const { t } = useTranslation('explore-page');

  return (
    <Dialog open={Boolean(service)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{service?.name}</DialogTitle>
          <DialogDescription>{service?.description}</DialogDescription>
        </DialogHeader>
        {service && (
          <>
            <dl className='grid grid-cols-[120px_1fr] items-center gap-y-3 text-body'>
              <dt className='text-muted-foreground'>{t('dialog.endpoint')}</dt>
              <dd className='flex min-w-0 items-center gap-2'>
                <span className='truncate font-mono text-small'>{service.endpoint}</span>
                <CopyButton value={service.endpoint} className='size-8 shrink-0' aria-label={t('dialog.copy-endpoint')} toastMessage={t('toasts.endpoint-copied')} />
              </dd>
              <dt className='text-muted-foreground'>{t('dialog.price')}</dt>
              <dd className='tabular-nums'>{service.priceLabel}</dd>
              <dt className='text-muted-foreground'>{t('dialog.currencies')}</dt>
              <dd>{service.currencies.join(', ')}</dd>
              <dt className='text-muted-foreground'>{t('dialog.category')}</dt>
              <dd>{service.category}</dd>
              <dt className='text-muted-foreground'>{t('dialog.provider')}</dt>
              <dd>{service.provider}</dd>
            </dl>
            <Button
              type='button'
              variant='link'
              size='sm'
              aria-expanded={detailsOpen}
              onClick={onToggleDetails}
              className='h-auto w-fit p-0 text-small font-normal text-muted-foreground underline hover:text-foreground'
            >
              {t(detailsOpen ? 'dialog.less-details' : 'dialog.more-details')}
            </Button>
            {detailsOpen && (
              <dl className='grid grid-cols-[120px_1fr] gap-y-2 border-t pt-4 text-body'>
                {Object.entries(service.details).flatMap(([key, value]) => [
                  <dt key={`${key}-k`} className='text-muted-foreground'>{key}</dt>,
                  <dd key={`${key}-v`}>{value}</dd>,
                ])}
                <dt className='text-muted-foreground'>{t('dialog.sales')}</dt>
                <dd className='tabular-nums'>{service.sales.toLocaleString()}</dd>
              </dl>
            )}
          </>
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
