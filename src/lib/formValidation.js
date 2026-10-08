const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validate a values object against a rules map.
 * Rule shape: { required?, email?, maxLength?, requiredMessage? }
 * Returns an object of field -> message (empty when valid).
 */
export function validate(values, rules) {
  const errors = {}
  for (const [field, rule] of Object.entries(rules)) {
    const value = String(values[field] ?? '').trim()
    if (rule.required && !value) {
      errors[field] = rule.requiredMessage ?? 'This field is required.'
      continue
    }
    if (value && rule.email && !EMAIL_RE.test(value)) {
      errors[field] = 'Enter a valid email address.'
      continue
    }
    if (value && rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `Please keep this under ${rule.maxLength} characters.`
    }
  }
  return errors
}
