import { forwardRef, SelectHTMLAttributes } from 'react'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  hasError?: boolean
}

/**
 * Select - Reusable select component
 * 
 * Supports all standard HTML select attributes and integrates with react-hook-form.
 * Use hasError prop to show error state styling.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ hasError = false, className = '', children, ...props }, ref) => {
    const baseStyles = 'block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-1'
    
    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-zinc-300 bg-white text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:focus:border-zinc-500'
    
    const combinedClassName = `${baseStyles} ${stateStyles} ${className}`.trim()
    
    return (
      <select ref={ref} className={combinedClassName} {...props}>
        {children}
      </select>
    )
  }
)

Select.displayName = 'Select'
