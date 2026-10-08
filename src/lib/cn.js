/**
 * Join class names, dropping falsy values.
 * Accepts strings and nested arrays of strings.
 */
export function cn(...values) {
  return values.flat(Infinity).filter(Boolean).join(' ')
}
