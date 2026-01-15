import { forwardRef, ButtonHTMLAttributes } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
  fullWidth?: boolean
}

/**
 * Button - Reusable button component
 * 
 * Variants:
 * - primary: Dark background with white text (default)
 * - secondary: Light background with dark text
 * - ghost: Transparent background with colored text
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidth = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'rounded-md px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors'
    
    const variantStyles = {
      primary: 'bg-zinc-900 text-white hover:bg-zinc-800 focus:ring-zinc-500 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500',
      ghost: 'text-gray-700 hover:text-gray-900 focus:ring-gray-500',
    }
    
    const widthStyle = fullWidth ? 'w-full' : ''
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`.trim()
    
    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
