import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: 'gray-100' | 'gray' | 'indigo';
  textColor?: 'gray-800' | 'gray-100';
  borderColor?: 'gray-300' | 'indigo-600';
  hoverColor?: 'gray-100' | 'gray-200' | 'indigo-700';
  focusColor?: 'gray-500' | 'indigo-500';
}

const Button: React.FC<ButtonProps> = ({
  color = 'gray-100',
  textColor = 'gray-800',
  borderColor = 'gray-300',
  hoverColor = 'gray-100',
  focusColor = 'gray-500',
  children,
  ...props
}) => {
  const colorClasses = {
    'gray-100': 'bg-gray-100',
    gray: 'bg-gray',
    indigo: 'bg-indigo-600',
  };

  const textColorClasses = {
    'gray-800': 'text-gray-800',
    'gray-100': 'text-gray-100',
  };

  const borderColorClasses = {
    'gray-300': 'border-gray-300',
    'indigo-600': 'border-indigo-600',
  };

  const hoverColorClasses = {
    'gray-100': 'hover:bg-gray-100',
    'gray-200': 'hover:bg-gray-200',
    'indigo-700': 'hover:bg-indigo-700',
  };

  const focusColorClasses = {
    'gray-500': 'focus:ring-gray-500',
    'indigo-500': 'focus:ring-indigo-500',
  };

  const buttonClasses = `
    w-1/3 ${colorClasses[color]} ${textColorClasses[textColor]} ${borderColorClasses[borderColor]} 
    py-2 px-4 rounded-md shadow-sm ${hoverColorClasses[hoverColor]} 
    focus:outline-none focus:ring-2 ${focusColorClasses[focusColor]} focus:ring-offset-2
  `;

  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
};

export default Button;
