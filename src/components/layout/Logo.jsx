import { Link } from 'react-router-dom'
import anaraLogo from '../../assets/anara-logo.png'
import { cn } from '../../lib/cn.js'

/**
 * Official ANARA logo mark plus the company wordmark.
 *
 * The logo has a transparent background and its proportions are preserved; the
 * source file is never modified. `inverse` only adapts text colors for dark
 * surfaces.
 */
function Logo({ inverse = false, showWordmark = true, className, ...props }) {
  return (
    <Link
      to="/"
      className={cn(
        'inline-flex items-center gap-2.5 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-600 focus-visible:ring-offset-2',
        inverse
          ? 'focus-visible:ring-offset-neutral-950'
          : 'focus-visible:ring-offset-white',
        className,
      )}
      {...props}
    >
      <img
        src={anaraLogo}
        alt="ANARA Technologies"
        width="44"
        height="40"
        decoding="async"
        className={cn('w-auto object-contain', inverse ? 'h-9' : 'h-10')}
      />

      {showWordmark && (
        <span aria-hidden="true" className="inline-flex items-baseline gap-1.5">
          <span
            className={cn(
              'text-xl font-extrabold tracking-tight',
              inverse ? 'text-white' : 'text-ink',
            )}
          >
            ANARA
          </span>
          <span
            className={cn(
              'text-xl font-semibold tracking-tight',
              inverse ? 'text-magenta-400' : 'text-magenta-700',
            )}
          >
            Technologies
          </span>
        </span>
      )}
    </Link>
  )
}

export default Logo
