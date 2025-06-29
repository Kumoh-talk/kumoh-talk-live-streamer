import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Button = (props: React.ComponentProps<'button'>) => {
  const { className, children, ...rest } = props;
  return (
    <button
      className={clsx(twMerge('px-4 py-2 rounded-lg cursor-pointer disabled:cursor-not-allowed', className), {'bg-gray-200' : !className?.includes('bg-')})}
      {...rest}
    >
      {children}
    </button>
  );
};
