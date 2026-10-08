import { cn } from '../../lib/cn.js'

const tones = {
  light: 'bg-canvas text-ink',
  muted: 'bg-surface-muted text-ink',
  dark: 'bg-neutral-950 text-white',
  brand: 'bg-anara-gradient text-white',
}

const spacing = {
  compact: 'py-12 sm:py-16',
  default: 'py-16 sm:py-20 lg:py-28',
  spacious: 'py-20 sm:py-28 lg:py-32',
}

/**
 * Vertical page section with a consistent rhythm and light/dark tones.
 * `tone`: light | muted | dark | brand
 */
function Section({
  as: Component = 'section',
  tone = 'light',
  size = 'default',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(spacing[size], tones[tone], className)}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Section
