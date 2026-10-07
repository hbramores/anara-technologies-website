const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')

/**
 * POST a JSON payload to a backend endpoint and normalize errors.
 * Throws an Error with a user-friendly message on failure.
 */
export async function submitForm(path, payload) {
  let response
  try {
    response = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    throw new Error(
      'We could not send your message right now. Please try again later.',
    )
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(
      data.message || 'Something went wrong. Please try again later.',
    )
  }

  return data
}
