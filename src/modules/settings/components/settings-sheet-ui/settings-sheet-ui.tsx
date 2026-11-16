import type { ReactNode } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';

type SettingsSheetUiProps = {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
};

const SettingsSheetUi = ({ open, title, description, onClose, children }: SettingsSheetUiProps) => (
  <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
    <SheetContent className='w-full gap-6 overflow-y-auto px-6 pt-6 sm:max-w-md'>
      <SheetHeader className='p-0 text-left'>
        <SheetTitle>{title}</SheetTitle>
        {description ? <SheetDescription>{description}</SheetDescription> : <SheetDescription className='sr-only'>{title}</SheetDescription>}
      </SheetHeader>
      {children}
    </SheetContent>
  </Sheet>
);

export default SettingsSheetUi;
