/**
 * Server-side reCAPTCHA verification.
 * If RECAPTCHA_SECRET is not configured, verification is skipped (local dev)
 * and the response records that it was skipped.
 */
export async function verifyCaptcha(token, remoteIp) {
  const secret = process.env.RECAPTCHA_SECRET
  if (!secret) {
    return { ok: true, skipped: true }
  }

  if (!token) {
    return { ok: false, message: 'Please complete the CAPTCHA and try again.' }
  }

  try {
    const params = new URLSearchParams({ secret, response: token })
    if (remoteIp) params.set('remoteip', remoteIp)

    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      { method: 'POST', body: params },
    )
    const data = await response.json()

    if (data.success) return { ok: true }

    return {
      ok: false,
      message: 'CAPTCHA verification failed. Please try again.',
    }
  } catch {
    return {
      ok: false,
      message: 'We could not verify the CAPTCHA. Please try again.',
    }
  }
}
