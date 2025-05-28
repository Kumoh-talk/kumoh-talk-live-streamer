export interface Props {
  label: string;
  labelWidth?: string;
  children: React.ReactNode;
}
export const InputForm = (props: Props) => {
  return (
    <div className="flex flex-row items-start gap-3 font-medium w-full">
      <span className="pt-2.5 px-4 leading-none" style={{ width: props.labelWidth || '120px' }}>
        {props.label}
      </span>
      <div className="flex flex-row gap-3 font-medium w-0 flex-1">{props.children}</div>
    </div>
  );
};
