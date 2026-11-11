import { cn } from '@/lib/utils';
import type { FCC } from '@/types';

type SectionWrapUiProps = {
  className?: string;
};

const SectionWrapUi: FCC<SectionWrapUiProps> = ({ children, className }) => {
  return <div className={cn('mx-auto w-full max-w-[1280px] px-4 md:px-10', className)}>{children}</div>;
};

export default SectionWrapUi;
