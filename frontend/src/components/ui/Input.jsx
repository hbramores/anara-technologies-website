import { useId } from 'react'
import { cn } from '../../lib/cn.js'
import FieldShell from './FieldShell.jsx'

export const fieldControlClasses =
  'w-full rounded-field border border-neutral-300 bg-white px-4 py-2.5 text-base text-ink shadow-sm transition-colors placeholder:text-neutral-400 focus:border-magenta-600 focus:outline-none focus:ring-2 focus:ring-magenta-500/30 disabled:cursor-not-allowed disabled:bg-neutral-50 disabled:text-neutral-500'

export const fieldErrorClasses =
  'border-red-500 focus:border-red-500 focus:ring-red-500/30'

/**
 * Single-line text input. Optionally renders a label, hint and error message.
 */
function Input({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const describedBy =
    [hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  const control = (
    <input
      id={fieldId}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(fieldControlClasses, error && fieldErrorClasses, className)}
      {...props}
    />
  )

  if (!label && !hint && !error) return control

  return (
    <FieldShell
      id={fieldId}
      label={label}
      hint={hint}
      error={error}
      required={required}
    >
      {control}
    </FieldShell>
  )
}

export default Input
