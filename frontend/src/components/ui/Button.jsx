import { Link } from 'react-router-dom'
import { cn } from '../../lib/cn.js'

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-600 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:pointer-events-none disabled:opacity-60'

/* Contrast-checked pairings (WCAG 2.1):
   primary  — white on #B0004B  ≈ 7.1:1  (AA/AAA normal text)
   dark     — white on neutral-900 ≈ 17:1
   secondary/ghost inherit ink on light surfaces. */
const variants = {
  primary: 'bg-magenta-700 text-white hover:bg-magenta-800 active:bg-magenta-900',
  secondary:
    'border border-neutral-300 bg-white text-ink hover:bg-neutral-50 active:bg-neutral-100',
  ghost: 'bg-transparent text-magenta-700 hover:bg-magenta-50 active:bg-magenta-100',
  dark: 'bg-neutral-900 text-white hover:bg-neutral-800 active:bg-black',
  link: 'rounded-none bg-transparent p-0 text-magenta-700 underline-offset-4 hover:underline',
}

const sizes = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-6 text-sm sm:text-base',
  lg: 'h-12 px-7 text-base',
}

/**
 * Polymorphic action element.
 * Renders a react-router <Link> when `to` is set, an <a> when `href` is set,
 * otherwise a <button>. `variant`: primary | secondary | ghost | dark | link
 */
function Button({
  variant = 'primary',
  size = 'md',
  to,
  href,
  type = 'button',
  className,
  children,
  ...props
}) {
  const classes = cn(
    base,
    variant !== 'link' && sizes[size],
    variants[variant],
    className,
  )

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  )
}

export default Button
