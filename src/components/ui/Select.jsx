import { useId } from 'react'
import { cn } from '../../lib/cn.js'
import FieldShell from './FieldShell.jsx'
import {
  fieldControlClasses,
  fieldErrorClasses,
} from './Input.jsx'

/**
 * Native select control. Optionally renders a label, hint and error message.
 * Pass options as <option> children.
 */
function Select({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  children,
  ...props
}) {
  const generatedId = useId()
  const fieldId = id ?? generatedId
  const describedBy =
    [hint ? `${fieldId}-hint` : null, error ? `${fieldId}-error` : null]
      .filter(Boolean)
      .join(' ') || undefined

  const control = (
    <select
      id={fieldId}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        fieldControlClasses,
        'cursor-pointer pr-10',
        error && fieldErrorClasses,
        className,
      )}
      {...props}
    >
      {children}
    </select>
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

export default Select
