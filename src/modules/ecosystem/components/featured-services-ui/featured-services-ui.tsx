import type { Service } from '@/apis/services';

type FeaturedServicesUiProps = {
  services: Service[];
};

const FeaturedServicesUi = ({ services }: FeaturedServicesUiProps) => {
  return (
    <div className='grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3'>
      {services.map((s) => (
        <div key={s.id} className='bg-background p-5'>
          <b className='font-display text-[22px] font-semibold'>{s.name}</b>
          <p className='mt-2 text-sm text-muted-foreground'>{s.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeaturedServicesUi;
