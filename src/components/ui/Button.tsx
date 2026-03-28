import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp' | 'call';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'default';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-brand text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'bg-brand-primary text-white hover:bg-brand-primary/90',
      secondary: 'bg-brand-secondary text-white hover:bg-brand-secondary/90',
      outline: 'border-2 border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white',
      ghost: 'hover:bg-brand-surface hover:text-brand-dark',
      whatsapp: 'bg-[#25D366] text-white hover:bg-[#128C7E]',
      call: 'bg-brand-secondary text-white hover:bg-brand-secondary/90',
    };
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8',
      xl: 'h-14 px-10 text-base',
    };

    const variantStyles = variants[variant] || variants.primary;
    const sizeStyles = sizes[size] || sizes.default;

    return (
      <button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
