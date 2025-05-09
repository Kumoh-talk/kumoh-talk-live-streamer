export interface Props {
  className?: string;
  value: number;
  direction?: 'horizontal' | 'vertical';
}
export const AudioLevelMeter = ({ className = '', value, direction = 'horizontal' }: Props) => {
  return (
    <div
      className={
        `border border-black flex ${
          direction === 'horizontal' ? 'flex-row justify-start' : 'flex-col justify-end'
        } items-stretch ` + className
      }
    >
      <div
        className="bg-blue-500"
        style={
          direction === 'horizontal' ? { width: `${value * 100}%` } : { height: `${value * 100}%` }
        }
      ></div>
    </div>
  );
};
