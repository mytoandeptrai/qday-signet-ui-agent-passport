import type { ReactNode } from 'react';

type SettingsSectionUiProps = {
  title: string;
  children: ReactNode;
};

const SettingsSectionUi = ({ title, children }: SettingsSectionUiProps) => (
  <section className='mt-8'>
    <h2 className='mb-2 text-body font-medium'>{title}</h2>
    <div className='divide-y overflow-hidden rounded-md border'>{children}</div>
  </section>
);

export default SettingsSectionUi;
