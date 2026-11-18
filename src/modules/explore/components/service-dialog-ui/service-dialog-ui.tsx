import type { Service, ServiceCallResult } from '@/apis/services';
import { Button } from '@/components/ui/button';
import CopyButton from '@/components/ui/copy-button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useTranslation } from '@/integrations/i18n';

type ServiceDialogUiProps = {
  service: Service | null;
  detailsOpen: boolean;
  canCall: boolean;
  isCalling: boolean;
  result: ServiceCallResult | null;
  onToggleDetails: () => void;
  onClose: () => void;
  onCall: () => void;
};

const ServiceDialogUi = ({ service, detailsOpen, canCall, isCalling, result, onToggleDetails, onClose, onCall }: ServiceDialogUiProps) => {
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
        {result && (
          <div className='min-w-0 border-t pt-4'>
            <p className='text-small text-muted-foreground'>{t('dialog.response', { status: result.status })}</p>
            <pre className='mt-2 max-h-48 overflow-auto bg-subtle p-3 font-mono text-small'>{result.body}</pre>
          </div>
        )}
        <DialogFooter className='items-center sm:justify-between'>
          {!canCall && <p className='text-small text-muted-foreground'>{t('dialog.needs-pass')}</p>}
          <Button type='button' disabled={!canCall || isCalling} onClick={onCall}>
            {t(isCalling ? 'dialog.calling' : 'dialog.call')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ServiceDialogUi;
