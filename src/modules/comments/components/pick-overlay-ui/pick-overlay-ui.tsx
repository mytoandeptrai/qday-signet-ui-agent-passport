import { useTranslation } from '@/integrations/i18n';

type PickOverlayUiProps = {
  hoverRect: DOMRect | null;
};

const PickOverlayUi = ({ hoverRect }: PickOverlayUiProps) => {
  const { t } = useTranslation('comments');

  return (
    <>
      {hoverRect && (
        <div
          className='pointer-events-none fixed z-99 rounded-sm border-2 border-primary bg-primary/10'
          style={{ left: hoverRect.left, top: hoverRect.top, width: hoverRect.width, height: hoverRect.height }}
        />
      )}
      <div className='pointer-events-none fixed left-1/2 top-3 z-100 -translate-x-1/2 rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background shadow-lg'>
        {t('pick-hint')}
      </div>
    </>
  );
};

export default PickOverlayUi;
