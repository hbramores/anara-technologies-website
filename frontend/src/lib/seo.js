const SITE_URL = (import.meta.env.VITE_SITE_URL ?? '').replace(/\/$/, '')
const OG_IMAGE = import.meta.env.VITE_OG_IMAGE_URL ?? ''

/*
 * Per-route metadata. Titles and descriptions are derived from approved PRD
 * copy only. Paths match the V1 routes.
 */
export const pageMeta = {
  '/': {
    title: 'ANARA Technologies — Digital Systems for Growing Businesses',
    description:
      'ANARA Technologies builds practical digital systems for growing businesses. From business problems to working systems.',
  },
  '/systems': {
    title: 'Systems — ANARA Technologies',
    description:
      'Digital systems developed under ANARA Technologies, including PLANTWAIS.',
  },
  '/plantwais': {
    title: 'PLANTWAIS — ANARA Technologies',
    description:
      'PLANTWAIS is a farm enterprise planning system in development at ANARA Technologies. It helps farmers plan activities, costs, and potential returns before a production cycle.',
  },
  '/services': {
    title: 'Services — ANARA Technologies',
    description:
      'Digital systems built around your business: custom software, web applications, business and management systems, and UI/UX design.',
  },
  '/about': {
    title: 'About — ANARA Technologies',
    description:
      'A New Approach to Real-world Advancement. Learn about ANARA Technologies, our vision, mission, and values.',
  },
  '/contact': {
    title: 'Contact — ANARA Technologies',
    description:
      'Have a question about ANARA, our systems, or working with us? Send us a message.',
  },
  '/start-a-project': {
    title: 'Start a Project — ANARA Technologies',
    description:
      'Tell us about your business and the problem you want to solve. You do not need to know what system you need.',
  },
}

export function getMeta(pathname) {
  return (
    pageMeta[pathname] ?? {
      title: 'ANARA Technologies',
      description:
        'ANARA Technologies builds practical digital systems for real-world needs.',
    }
  )
}

export function siteUrl() {
  return SITE_URL
}

function upsertMeta(attribute, key, content) {
  if (!content) return
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
}

export function applyMeta({ title, description, image }, pathname) {
  const socialImage = image || OG_IMAGE

  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:site_name', 'ANARA Technologies')
  upsertMeta('property', 'og:locale', 'en_PH')
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:type', 'website')
  upsertMeta(
    'name',
    'twitter:card',
    socialImage ? 'summary_large_image' : 'summary',
  )
  upsertMeta('name', 'twitter:title', title)
  upsertMeta('name', 'twitter:description', description)

  if (socialImage) {
    upsertMeta('property', 'og:image', socialImage)
    upsertMeta('name', 'twitter:image', socialImage)
  }

  if (SITE_URL) {
    upsertMeta('property', 'og:url', `${SITE_URL}${pathname}`)
    let canonical = document.head.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', `${SITE_URL}${pathname}`)
  }
}
