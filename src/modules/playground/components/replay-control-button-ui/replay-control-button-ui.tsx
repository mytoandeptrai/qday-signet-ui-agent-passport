import type { ReactNode } from 'react';

type ReplayControlButtonUiProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
};

const ReplayControlButtonUi = ({ label, onClick, children }: ReplayControlButtonUiProps) => (
  <button
    type='button'
    aria-label={label}
    title={label}
    onClick={onClick}
    className='flex size-7 items-center justify-center rounded text-white/60 hover:bg-white/10 hover:text-white'
  >
    {children}
  </button>
);

export default ReplayControlButtonUi;
