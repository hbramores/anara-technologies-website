/**
 * Small decorative UI icons. All are presentational (aria-hidden) and inherit
 * `currentColor`, so callers control size via className.
 */

export function ArrowRight({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  )
}

export function ArrowDown({ className = 'h-4 w-4' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 4v12M5 11l5 5 5-5" />
    </svg>
  )
}
