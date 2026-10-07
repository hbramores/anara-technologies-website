import { cn } from '../../lib/cn.js'

/**
 * Layout wrapper for a single form control: label, control, hint and error.
 * Hint/error element ids follow the `${id}-hint` / `${id}-error` convention so
 * controls can reference them with aria-describedby.
 */
function FieldShell({
  id,
  label,
  hint,
  error,
  required = false,
  className,
  children,
}) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="text-magenta-700" aria-hidden="true">
              {' '}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}

export default FieldShell
