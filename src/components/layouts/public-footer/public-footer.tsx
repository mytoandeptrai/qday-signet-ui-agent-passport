import { Link } from '@tanstack/react-router';
import { SignetLockup } from '@/components/brand/signet-mark';
import { useTranslation } from '@/integrations/i18n';
import { footerColumns } from './public-footer.config';

const PublicFooter = () => {
  const { t } = useTranslation('public-layout');

  return (
    <footer className='relative z-4 border-t bg-card py-14 text-body text-muted-foreground'>
      <div className='mx-auto max-w-7xl px-4 md:px-10'>
        <div className='grid grid-cols-2 gap-10 md:grid-cols-[2fr_repeat(3,1fr)]'>
          <div>
            <SignetLockup className='h-7' />
          </div>
          {footerColumns(t).map((col) => (
            <div key={col.title}>
              <h5 className='mb-3.5 text-body font-medium text-foreground'>{col.title}</h5>
              {col.links.map((l) =>
                l.href.startsWith('/') && !l.href.startsWith('/#') ? (
                  <Link key={l.label} to={l.href} className='block py-1 hover:text-foreground'>
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={l.href} className='block py-1 hover:text-foreground'>
                    {l.label}
                  </a>
                )
              )}
            </div>
          ))}
        </div>
        <div className='mt-14 flex justify-between border-t pt-5 text-text-3'>
          <span>{t('footer.copyright')}</span>
          <a href='#' className='hover:text-foreground'>
            {t('footer.feedback')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default PublicFooter;
