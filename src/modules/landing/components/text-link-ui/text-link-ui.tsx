import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import type { FCC } from '@/types';

type TextLinkUiProps = {
  to?: string;
  href?: string;
};

const className = 'mt-6 inline-flex gap-[7px] text-[15px] transition-colors hover:text-muted-foreground';

const TextLinkUi: FCC<TextLinkUiProps> = ({ to, href, children }) => {
  const body = (
    <>
      {children} <ArrowRightIcon className='size-4' aria-hidden='true' />
    </>
  );
  return to ? (
    <Link to={to} className={className}>
      {body}
    </Link>
  ) : (
    <a href={href} className={className}>
      {body}
    </a>
  );
};

export default TextLinkUi;
