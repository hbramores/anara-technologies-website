import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import { cn } from '../../lib/cn.js'
import { primaryCta, primaryNav } from '../../lib/navigation.js'
import Logo from './Logo.jsx'

function isHome(to) {
  return to === '/'
}

function MenuIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      className="h-6 w-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function Header() {
  const [open, setOpen] = useState(false)

  // Close on Escape only while the mobile menu is open.
  useEffect(() => {
    if (!open) return undefined
    function handleKeyDown(event) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Logo />

          <nav
            aria-label="Primary"
            className="hidden items-center gap-8 lg:flex"
          >
            {primaryNav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={isHome(item.to)}
                className={({ isActive }) =>
                  cn(
                    'text-sm font-medium transition-colors',
                    isActive
                      ? 'text-magenta-700'
                      : 'text-ink-muted hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <span className="relative inline-block py-2">
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-magenta-700 transition-opacity',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="hidden lg:block">
            <Button to={primaryCta.to}>{primaryCta.label}</Button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-600 lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </Container>

      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-white lg:hidden"
        >
          <Container className="py-4">
            <nav aria-label="Primary mobile" className="flex flex-col gap-1">
              {primaryNav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={isHome(item.to)}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-field px-3 py-3 text-base font-medium transition-colors',
                      isActive
                        ? 'bg-magenta-50 font-semibold text-magenta-700'
                        : 'text-ink hover:bg-neutral-50',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Button
              to={primaryCta.to}
              onClick={() => setOpen(false)}
              className="mt-3 w-full"
            >
              {primaryCta.label}
            </Button>
          </Container>
        </div>
      )}
    </header>
  )
}

export default Header
