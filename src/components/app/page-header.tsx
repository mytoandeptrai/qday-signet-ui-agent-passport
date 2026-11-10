export function PageHeader({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className='mb-6 flex flex-wrap items-end justify-between gap-4'>
      <div>
        <h1 className='font-display text-title leading-[1.15] font-semibold tracking-[-0.016em]'>{title}</h1>
        {description && <p className='mt-1.5 max-w-xl text-body text-muted-foreground'>{description}</p>}
      </div>
      {action}
    </div>
  );
}
