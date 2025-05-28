export const InputGroup = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <div className="flex flex-col gap-2 font-medium py-2">
      <span className="px-4 py-1 leading-none text-gray-400">{label}</span>
      {children}
    </div>
  );
};
