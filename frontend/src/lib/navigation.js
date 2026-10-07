/**
 * Single source of truth for global navigation.
 * Used by the header (desktop + mobile) and the footer so destinations
 * never drift apart.
 */

export const primaryNav = [
  { label: 'Home', to: '/' },
  { label: 'Systems', to: '/systems' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

export const primaryCta = { label: 'Start a Project', to: '/start-a-project' }

export const systemsNav = [{ label: 'PLANTWAIS', to: '/plantwais' }]
