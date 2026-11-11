import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { shortAddress } from '@/lib/format';

interface ShortAddressProps {
  value: string;
}

/** Shortens a 0x address and shows the full one in a tooltip; anything else renders as is. */
const ShortAddress = ({ value }: ShortAddressProps) => {
  if (!value.startsWith('0x') || value.length <= 20) return <>{value}</>;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span tabIndex={0}>{shortAddress(value)}</span>
      </TooltipTrigger>
      <TooltipContent className='font-mono'>{value}</TooltipContent>
    </Tooltip>
  );
};

export default ShortAddress;
