import { PageHeader } from '@/components/ui/page-header';
import { ExploreFiltersUi, ServiceDialogUi, ServiceGridUi, ServicePaginationUi } from '../../components';
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
    page,
    pageCount,
    picked,
    detailsOpen,
    canCall,
    isCalling,
    result,
    onSearchChange,
    onCategoryChange,
    onSortChange,
    onPageChange,
    onPick,
    onToggleDetails,
    onClosePicked,
    onCall,
  } = useExploreContainer();

  return (
    <div className='mx-auto w-full max-w-275'>
      <PageHeader title={t('title')} description={t('description', { count: featuredCount })} />
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
      <ServicePaginationUi page={page} pageCount={pageCount} onPageChange={onPageChange} />
      <ServiceDialogUi
        service={picked}
        detailsOpen={detailsOpen}
        canCall={canCall}
        isCalling={isCalling}
        result={result}
        onToggleDetails={onToggleDetails}
        onClose={onClosePicked}
        onCall={onCall}
      />
    </div>
  );
};

export default ExploreContainer;
