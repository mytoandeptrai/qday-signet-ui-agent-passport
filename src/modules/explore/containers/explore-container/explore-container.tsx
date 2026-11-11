import { ExploreFiltersUi, ServiceDialogUi, ServiceGridUi } from '../../components';
import { useExploreContainer } from '../../hooks';

const ExploreContainer = () => {
  const {
    t,
    featuredCount,
    categories,
    category,
    sort,
    search,
    query,
    services,
    isFetching,
    picked,
    isSignedIn,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onPick,
    onClosePicked,
    onUse,
  } = useExploreContainer();

  return (
    <div className='mx-auto w-full max-w-275'>
      <h1 className='font-display text-[clamp(34px,3.1vw,46px)] leading-tight font-semibold tracking-tight'>{t('title')}</h1>
      <p className='mt-3 text-muted-foreground'>{t('description', { count: featuredCount })}</p>
      <ExploreFiltersUi
        search={search}
        sort={sort}
        category={category}
        categories={categories}
        onSearchChange={onSearchChange}
        onSortChange={onSortChange}
        onCategoryChange={onCategoryChange}
      />
      <ServiceGridUi services={services} isFetching={isFetching} query={query} onPick={onPick} />
      <ServiceDialogUi service={picked} isSignedIn={isSignedIn} onClose={onClosePicked} onUse={onUse} />
    </div>
  );
};

export default ExploreContainer;
