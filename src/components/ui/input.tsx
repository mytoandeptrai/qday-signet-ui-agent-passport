import * as React from 'react';

import { cn } from '@/lib/utils';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  suffix?: React.ReactNode;
  prefix?: React.ReactNode;
  containerClassName?: InputProps['className'];
}

const Input = ({
  ref,
  className,
  type,
  suffix,
  prefix,
  containerClassName,
  required,
  ...props
}: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const [isShowPassword, setIsShowPassword] = React.useState<Boolean>(false);

  return (
    <div className={cn('relative', containerClassName)}>
      {prefix && (
        <label
          htmlFor={props.id}
          className={cn('pointer-events-none absolute top-1/2 left-5 -translate-x-1/2 -translate-y-1/2')}
        >
          {prefix}
        </label>
      )}
      <input
        ref={ref}
        type={type === 'password' && isShowPassword ? 'text' : type}
        data-slot='input'
        autoComplete='off'
        className={cn(
          'flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-body shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-body placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30',
          'focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
          className
        )}
        {...props}
      />
      {suffix && type !== 'password' && (
        <label htmlFor={props.id} className='absolute top-1/2 right-5 z-10 -translate-y-1/2'>
          {suffix}
        </label>
      )}

      {type === 'password' && (
        <button
          type='button'
          onClick={() => setIsShowPassword(!isShowPassword)}
          className={cn('absolute top-1/2 right-[10px] z-10 -translate-y-1/2 cursor-pointer')}
        >
          {isShowPassword ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />}
        </button>
      )}
    </div>
  );
};

export { Input };
