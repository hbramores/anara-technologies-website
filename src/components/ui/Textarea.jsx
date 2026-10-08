import { useId } from 'react'
import { cn } from '../../lib/cn.js'
import FieldShell from './FieldShell.jsx'
import {
  fieldControlClasses,
  fieldErrorClasses,
} from './Input.jsx'

/**
 * Multi-line text input. Optionally renders a label, hint and error message.
 */
function Textarea({
  id,
  label,
  hint,
  error,
  required = false,
  rows = 5,
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
    <textarea
      id={fieldId}
      rows={rows}
      required={required}
      aria-invalid={error ? true : undefined}
      aria-describedby={describedBy}
      className={cn(
        fieldControlClasses,
        'min-h-32 resize-y',
        error && fieldErrorClasses,
        className,
      )}
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

export default Textarea
