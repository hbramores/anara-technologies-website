import { useState } from 'react'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Textarea from '../ui/Textarea.jsx'
import { submitForm } from '../../lib/api.js'
import { trackEvent } from '../../lib/analytics.js'
import { validate } from '../../lib/formValidation.js'
import Captcha from './Captcha.jsx'

const rules = {
  fullName: { required: true, maxLength: 100 },
  email: { required: true, email: true, maxLength: 254 },
  business: { maxLength: 150 },
  subject: { required: true, maxLength: 150 },
  message: { required: true, maxLength: 2000 },
}

const initialValues = {
  fullName: '',
  email: '',
  business: '',
  subject: '',
  message: '',
}

function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [captchaToken, setCaptchaToken] = useState('')

  const setField = (field) => (event) =>
    setValues((current) => ({ ...current, [field]: event.target.value }))

  const handleBlur = (field) => () => {
    const fieldErrors = validate(values, { [field]: rules[field] })
    setErrors((current) => ({ ...current, [field]: fieldErrors[field] }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validate(values, rules)
    setErrors(nextErrors)
    setErrorMessage('')
    if (Object.values(nextErrors).some(Boolean)) {
      setStatus('idle')
      return
    }

    setStatus('submitting')
    try {
      await submitForm('/api/contact', { ...values, captchaToken })
      trackEvent('contact_submitted')
      setStatus('success')
      setValues(initialValues)
    } catch (error) {
      setStatus('error')
      setErrorMessage(error.message)
    }
  }

  if (status === 'success') {
    return (
      <div
        role="status"
        className="rounded-card border border-magenta-100 bg-magenta-50 p-6 sm:p-8"
      >
        <h3 className="text-lg font-semibold text-ink">
          Thanks — your message has been sent.
        </h3>
        <p className="mt-2 leading-relaxed text-ink-muted">
          We’ll get back to you using the details you provided.
        </p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5"
      aria-describedby="contact-form-error"
    >
      <Input
        id="contact-fullName"
        label="Full Name"
        required
        autoComplete="name"
        maxLength={100}
        value={values.fullName}
        onChange={setField('fullName')}
        onBlur={handleBlur('fullName')}
        error={errors.fullName}
      />
      <Input
        id="contact-email"
        label="Email Address"
        type="email"
        required
        autoComplete="email"
        maxLength={254}
        value={values.email}
        onChange={setField('email')}
        onBlur={handleBlur('email')}
        error={errors.email}
      />
      <Input
        id="contact-business"
        label="Business / Organization"
        autoComplete="organization"
        maxLength={150}
        value={values.business}
        onChange={setField('business')}
        onBlur={handleBlur('business')}
        error={errors.business}
      />
      <Input
        id="contact-subject"
        label="Subject"
        required
        maxLength={150}
        value={values.subject}
        onChange={setField('subject')}
        onBlur={handleBlur('subject')}
        error={errors.subject}
      />
      <Textarea
        id="contact-message"
        label="Message"
        required
        rows={6}
        maxLength={2000}
        value={values.message}
        onChange={setField('message')}
        onBlur={handleBlur('message')}
        error={errors.message}
      />

      <Captcha
        action="contact form"
        onToken={setCaptchaToken}
        onExpire={() => setCaptchaToken('')}
      />

      {status === 'error' && (
        <p
          id="contact-form-error"
          role="alert"
          className="rounded-field border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send Message'}
        </Button>
      </div>
    </form>
  )
}

export default ContactForm
