import clsx from 'clsx';

export const Button = (props: React.ComponentProps<'button'>) => {
  const { className, children, ...rest } = props;
  return (
    <button
      className={clsx('px-4 py-2 rounded-lg', className, {'bg-gray-200' : !className?.includes('bg-')})}
      {...rest}
    >
      {children}
    </button>
  );
};
