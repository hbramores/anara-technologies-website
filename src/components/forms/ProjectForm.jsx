import { useState } from 'react'
import Button from '../ui/Button.jsx'
import Input from '../ui/Input.jsx'
import Select from '../ui/Select.jsx'
import Textarea from '../ui/Textarea.jsx'
import { submitForm } from '../../lib/api.js'
import { trackEvent } from '../../lib/analytics.js'
import { validate } from '../../lib/formValidation.js'
import Captcha from './Captcha.jsx'

const budgetOptions = [
  'Not sure yet',
  'Below ₱20,000',
  '₱20,000–₱50,000',
  '₱50,000–₱100,000',
  '₱100,000+',
]

const timelineOptions = [
  'No specific deadline',
  'Within 1 month',
  '1–3 months',
  '3–6 months',
  '6+ months',
]

const rules = {
  fullName: { required: true, maxLength: 100 },
  email: { required: true, email: true, maxLength: 254 },
  contactNumber: { maxLength: 50 },
  businessName: { required: true, maxLength: 150 },
  businessType: { maxLength: 150 },
  businessDescription: { required: true, maxLength: 2000 },
  currentProcess: { maxLength: 2000 },
  problem: { required: true, maxLength: 2000 },
  desiredOutcome: { required: true, maxLength: 2000 },
  budget: { maxLength: 50 },
  timeline: { maxLength: 50 },
  additionalInfo: { maxLength: 2000 },
}

const initialValues = {
  fullName: '',
  email: '',
  contactNumber: '',
  businessName: '',
  businessType: '',
  businessDescription: '',
  currentProcess: '',
  problem: '',
  desiredOutcome: '',
  budget: '',
  timeline: '',
  additionalInfo: '',
}

function ProjectForm() {
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

  function fieldProps(field, extra = {}) {
    return {
      id: `project-${field}`,
      value: values[field],
      onChange: setField(field),
      onBlur: handleBlur(field),
      error: errors[field],
      ...extra,
    }
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
      await submitForm('/api/project', { ...values, captchaToken })
      trackEvent('project_inquiry_submitted')
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
          Thanks for telling us about your project.
        </h3>
        <p className="mt-2 leading-relaxed text-ink-muted">
          ANARA will review your inquiry and contact you to better understand
          your needs and discuss whether we can help.
        </p>
        <p className="mt-3 text-sm text-ink-muted">
          Submitting an inquiry does not mean ANARA has accepted the project.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-ink">About You</legend>
        <Input
          {...fieldProps('fullName', {
            label: 'Full Name',
            required: true,
            autoComplete: 'name',
            maxLength: 100,
          })}
        />
        <Input
          {...fieldProps('email', {
            label: 'Email Address',
            type: 'email',
            required: true,
            autoComplete: 'email',
            maxLength: 254,
          })}
        />
        <Input
          {...fieldProps('contactNumber', {
            label: 'Contact Number',
            type: 'tel',
            inputMode: 'tel',
            autoComplete: 'tel',
            maxLength: 50,
          })}
        />
        <Input
          {...fieldProps('businessName', {
            label: 'Business / Organization Name',
            required: true,
            autoComplete: 'organization',
            maxLength: 150,
          })}
        />
        <Input
          {...fieldProps('businessType', {
            label: 'Business Type / Industry',
            maxLength: 150,
          })}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-ink">
          About the Business
        </legend>
        <Textarea
          {...fieldProps('businessDescription', {
            label: 'What does your business or organization do?',
            required: true,
            rows: 4,
            maxLength: 2000,
          })}
        />
        <Textarea
          {...fieldProps('currentProcess', {
            label:
              'How are you currently handling the process you want to improve?',
            rows: 4,
            maxLength: 2000,
          })}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-ink">
          About the Problem
        </legend>
        <Textarea
          {...fieldProps('problem', {
            label: 'What problem are you trying to solve?',
            required: true,
            rows: 4,
            maxLength: 2000,
          })}
        />
        <Textarea
          {...fieldProps('desiredOutcome', {
            label: 'What would you like a system to help you accomplish?',
            required: true,
            rows: 4,
            maxLength: 2000,
          })}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="text-lg font-semibold text-ink">
          Project Details
        </legend>
        <Select
          {...fieldProps('budget', {
            label: 'Estimated Budget',
            hint: 'Optional.',
          })}
        >
          <option value="">Select a range (optional)</option>
          {budgetOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Select
          {...fieldProps('timeline', {
            label: 'Target Timeline',
            hint: 'Optional.',
          })}
        >
          <option value="">Select a timeline (optional)</option>
          {timelineOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Textarea
          {...fieldProps('additionalInfo', {
            label: 'Additional Information',
            hint: 'Optional.',
            rows: 4,
            maxLength: 2000,
          })}
        />
      </fieldset>

      <Captcha
        action="project inquiry form"
        onToken={setCaptchaToken}
        onExpire={() => setCaptchaToken('')}
      />

      {status === 'error' && (
        <p
          role="alert"
          className="rounded-field border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700"
        >
          {errorMessage}
        </p>
      )}

      <div>
        <Button type="submit" size="lg" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Submitting…' : 'Submit Project Inquiry'}
        </Button>
      </div>
    </form>
  )
}

export default ProjectForm
