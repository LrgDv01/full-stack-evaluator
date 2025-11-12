export default function Button({
  isDarkMode,
  label,
  variant = 'primary',
  onClick,
  size = 'md',
  disabled = false,
  type,
  className = '',
  icon = null,
}) {
  const baseStyles =
    'font-bold rounded-3xl transition-all duration-200 flex items-center justify-center gap-2';

  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-700 disabled:bg-blue-300',
    secondary: `dark:hover:bg-gray-400 disabled:bg-gray-100 ${isDarkMode.componentsBgMode}`,
    danger: 'bg-red-500 text-white hover:bg-red-700 disabled:bg-red-300',
    success: 'bg-green-500 text-white hover:bg-green-700 disabled:bg-green-300',
    dark: 'bg-gray-700 text-blue-400 hover:bg-gray-800 disabled:bg-gray-500',
    light: 'bg-gray-300 text-yellow-700 hover:bg-gray-200 disabled:bg-gray-400 border',
  };

  const sizes = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };

  const toggleStyle = isDarkMode ? variants.light : variants.dark;
  console.log('BUTTON :', isDarkMode);
  console.log('TYPE :', type);

  return (
    <button
      type={type}
      className={`${baseStyles} ${type === 'toggle' ? toggleStyle : variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}

    >    
      {icon && <span className="w-5 h-5">{icon}</span>}
      {label}
    </button>
  );
}