import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { applyMeta, getMeta } from '../../lib/seo.js'

/**
 * Applies per-route <title> and meta tags on navigation (SPA).
 */
function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    applyMeta(getMeta(pathname), pathname)
  }, [pathname])

  return null
}

export default SeoManager
