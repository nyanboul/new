interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export default function Input({ label, id, className = '', ...props }: InputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <input
          id={id}
          className={`block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#6C3CE1] focus:outline-none focus:ring-[#6C3CE1] ${className}`}
          {...props}
        />
      </div>
    </div>
  );
} 