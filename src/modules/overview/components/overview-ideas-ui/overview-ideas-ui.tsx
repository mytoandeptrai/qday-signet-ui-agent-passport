import { useTranslation } from '@/integrations/i18n';
import { Link } from '@tanstack/react-router';
import type { IdeaId } from '../../utils';

type OverviewIdeasUiProps = {
  ideas: readonly IdeaId[];
};

/** The ten scenarios, numbered as in the playground: a strip to scroll through, not a list to scan. */
const OverviewIdeasUi = ({ ideas }: OverviewIdeasUiProps) => {
  const { t } = useTranslation('overview-page');
  return (
    <section className='mt-14'>
      <h2 className='text-body text-muted-foreground'>{t('ideas.title')}</h2>
      <ul className='-mx-1 mt-4 flex snap-x snap-mandatory gap-5 overflow-x-auto px-1 pb-3'>
        {ideas.map((id, i) => (
          <li key={id} className='w-36 shrink-0 snap-start'>
            <Link to='/playground' search={{ idea: id }} className='group block'>
              <img src={`/images/ideas/${id}.svg`} alt='' className='aspect-square w-full rounded-md' />
              <span className='mt-2 block text-small text-muted-foreground tabular-nums'>{String(i).padStart(2, '0')}</span>
              <span className='block text-body leading-snug group-hover:underline'>{t(`ideas.items.${id}`)}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default OverviewIdeasUi;
