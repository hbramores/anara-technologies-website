import { cn } from '../../lib/cn.js'

const sizes = {
  narrow: 'max-w-3xl',
  default: 'max-w-content',
  wide: 'max-w-7xl',
}

/**
 * Centered, width-constrained page content wrapper with responsive gutters.
 */
function Container({
  as: Component = 'div',
  size = 'default',
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        'mx-auto w-full px-5 sm:px-6 lg:px-8',
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}

export default Container
