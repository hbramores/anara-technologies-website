import { useEffect, useRef } from 'react'

const SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY

/*
 * Google reCAPTCHA v2 (checkbox), rendered only when a site key is configured.
 * Without a key nothing renders and the form submits without a token; the
 * backend decides whether a token is required. See README for setup.
 */
function Captcha({ onToken, onExpire, action = 'submit' }) {
  const containerRef = useRef(null)
  const widgetIdRef = useRef(null)
  const onTokenRef = useRef(onToken)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onTokenRef.current = onToken
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!SITE_KEY) return undefined

    function render() {
      if (
        !containerRef.current ||
        widgetIdRef.current !== null ||
        !window.grecaptcha?.render
      ) {
        return
      }
      widgetIdRef.current = window.grecaptcha.render(containerRef.current, {
        sitekey: SITE_KEY,
        callback: (token) => onTokenRef.current?.(token),
        'expired-callback': () => onExpireRef.current?.(),
      })
    }

    if (window.grecaptcha?.render) {
      render()
      return undefined
    }

    const selector = 'script[data-anara-recaptcha]'
    const existing = document.querySelector(selector)
    if (existing) {
      existing.addEventListener('load', render)
      return () => existing.removeEventListener('load', render)
    }

    const script = document.createElement('script')
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit'
    script.async = true
    script.defer = true
    script.dataset.anaraRecaptcha = 'true'
    script.addEventListener('load', render)
    document.head.appendChild(script)

    return () => script.removeEventListener('load', render)
  }, [])

  if (!SITE_KEY) return null

  return (
    <div
      ref={containerRef}
      className="min-h-[78px]"
      aria-label={`CAPTCHA for ${action}`}
    />
  )
}

export default Captcha
