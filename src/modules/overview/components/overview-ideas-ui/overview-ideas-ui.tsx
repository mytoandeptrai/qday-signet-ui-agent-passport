import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';
import type { IdeaId } from '../../utils';

type OverviewIdeasUiProps = {
  ideas: readonly IdeaId[];
};

const OverviewIdeasUi = ({ ideas }: OverviewIdeasUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <>
      <div className='flex items-baseline justify-between'>
        <h2 className='text-body text-muted-foreground'>{t('ideas.title')}</h2>
        <Link to='/overview' search={{ dialog: 'create-session' }} className='flex items-center gap-1.5 text-body text-muted-foreground hover:text-foreground'>
          {t('labels.new-session')}
        </Link>
      </div>
      <div className='mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2'>
        {ideas.map((id) => (
          <Link key={id} to='/playground' search={{ idea: id }} className='group flex items-center gap-4 py-2'>
            <img src={`/images/ideas/${id}.svg`} alt='' className='size-12 shrink-0 rounded-[14px]' />
            <span className='text-lead leading-[1.35] group-hover:underline'>{t(`ideas.items.${id}`)}</span>
          </Link>
        ))}
      </div>
    </>
  );
};

export default OverviewIdeasUi;
