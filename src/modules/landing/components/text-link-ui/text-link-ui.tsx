import { Link } from '@tanstack/react-router';
import { ArrowRightIcon } from 'lucide-react';
import type { FCC } from '@/types';

type TextLinkUiProps = {
  to?: string;
  href?: string;
};

const className = 'mt-6 inline-flex gap-1.75 text-lead transition-colors hover:text-muted-foreground';

const TextLinkUi: FCC<TextLinkUiProps> = ({ to, href, children }) => {
  const body = (
    <>
      {children} <ArrowRightIcon className='size-4 mt-1' aria-hidden='true' />
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
