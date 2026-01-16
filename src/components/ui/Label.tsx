import { forwardRef, LabelHTMLAttributes } from 'react'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

/**
 * Label - Reusable label component for form fields
 * 
 * Provides consistent styling for form labels with dark mode support.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className = '', children, ...props }, ref) => {
    const baseStyles = 'block text-sm font-medium text-zinc-900 dark:text-zinc-100'
    const combinedClassName = `${baseStyles} ${className}`.trim()
    
    return (
      <label ref={ref} className={combinedClassName} {...props}>
        {children}
      </label>
    )
  }
)

Label.displayName = 'Label'
