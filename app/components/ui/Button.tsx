interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export default function Button({ 
  variant = 'primary', 
  fullWidth = false, 
  children, 
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = "rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors";
  const variantStyles = {
    primary: "border-transparent bg-[#6C3CE1] text-white hover:bg-opacity-90",
    secondary: "border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
  };
  const widthStyles = fullWidth ? "w-full justify-center" : "";

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
} 