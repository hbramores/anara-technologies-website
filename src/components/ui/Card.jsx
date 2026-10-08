import { cn } from '../../lib/cn.js'

const tones = {
  default: 'border-neutral-200 bg-white',
  muted: 'border-neutral-200 bg-neutral-50',
  brand: 'border-magenta-100 bg-magenta-50',
  dark: 'border-neutral-800 bg-neutral-900 text-white',
}

const padding = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

/**
 * Rounded surface for grouped content.
 * `tone`: default | muted | brand | dark
 */
function Card({
  as: Component = 'div',
  tone = 'default',
  size = 'md',
  interactive = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'rounded-card border shadow-sm',
        tones[tone],
        padding[size],
        interactive && 'transition-shadow hover:shadow-md',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Card
