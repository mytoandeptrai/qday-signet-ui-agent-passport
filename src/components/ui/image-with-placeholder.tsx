import type { ImgHTMLAttributes, Ref } from 'react';
import { useState } from 'react';

interface IImageWithPlaceholderProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  className?: string;
  ref?: Ref<HTMLImageElement>;
}

const ImageWithPlaceholder = ({ src, alt, placeholder = '/svg/no-record.svg', ref, ...props }: IImageWithPlaceholderProps) => {
  const [error, setError] = useState(false);
  return (
    <img
      ref={ref}
      src={error ? placeholder : src}
      alt={alt}
      onError={() => {
        setError(true);
      }}
      {...props}
    />
  );
};

export default ImageWithPlaceholder;
