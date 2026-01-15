import { forwardRef, InputHTMLAttributes } from 'react'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

/**
 * Input - Reusable input component
 * 
 * Supports all standard HTML input attributes and integrates with react-hook-form.
 * Use hasError prop to show error state styling.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ hasError = false, className = '', ...props }, ref) => {
    const baseStyles = 'block w-full rounded-md border px-3 py-2 placeholder-zinc-400 focus:outline-none focus:ring-1'
    
    const stateStyles = hasError
      ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
      : 'border-zinc-300 bg-white text-zinc-900 focus:border-zinc-500 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus:border-zinc-500'
    
    const combinedClassName = `${baseStyles} ${stateStyles} ${className}`.trim()
    
    return (
      <input ref={ref} className={combinedClassName} {...props} />
    )
  }
)

Input.displayName = 'Input'
