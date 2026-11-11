import { Link } from '@tanstack/react-router';

type PublicHeaderNavLinkProps = {
  href: string;
  label: string;
  className?: string;
  onClick?: () => void;
};

const PublicHeaderNavLink = ({ href, label, className, onClick }: PublicHeaderNavLinkProps) => {
  if (href.startsWith('/') && !href.startsWith('/#')) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {label}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {label}
    </a>
  );
};

export default PublicHeaderNavLink;
