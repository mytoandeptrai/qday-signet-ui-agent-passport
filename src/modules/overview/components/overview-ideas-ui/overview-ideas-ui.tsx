import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';
import type { IdeaId } from '../../utils';

type OverviewIdeasUiProps = {
  ideas: readonly IdeaId[];
};

/** The ten scenarios, numbered as in the playground: a compact grid of small thumbnails. */
const OverviewIdeasUi = ({ ideas }: OverviewIdeasUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <section className='mt-14'>
      <h2 className='text-body text-muted-foreground'>{t('ideas.title')}</h2>
      <ul className='mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3'>
        {ideas.map((id, i) => (
          <li key={id}>
            <Link to='/playground' search={{ idea: id }} className='group flex items-center gap-3'>
              <img src={`/images/ideas/${id}.svg`} alt='' className='size-12 shrink-0 rounded-md' />
              <span className='text-small text-muted-foreground tabular-nums'>{String(i).padStart(2, '0')}</span>
              <span className='min-w-0 text-body leading-snug group-hover:underline'>{t(`ideas.items.${id}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OverviewIdeasUi;
