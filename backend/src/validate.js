const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function str(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function check(errors, field, value, { required, email, maxLength, label }) {
  if (required && !value) {
    errors[field] = `${label} is required.`
    return
  }
  if (value && email && !EMAIL_RE.test(value)) {
    errors[field] = 'Enter a valid email address.'
    return
  }
  if (value && maxLength && value.length > maxLength) {
    errors[field] = `${label} is too long.`
  }
}

export function validateContact(body) {
  const value = {
    fullName: str(body.fullName),
    email: str(body.email),
    business: str(body.business),
    subject: str(body.subject),
    message: str(body.message),
  }
  const errors = {}
  check(errors, 'fullName', value.fullName, {
    required: true,
    maxLength: 100,
    label: 'Full name',
  })
  check(errors, 'email', value.email, {
    required: true,
    email: true,
    maxLength: 254,
    label: 'Email address',
  })
  check(errors, 'business', value.business, {
    maxLength: 150,
    label: 'Business / organization',
  })
  check(errors, 'subject', value.subject, {
    required: true,
    maxLength: 150,
    label: 'Subject',
  })
  check(errors, 'message', value.message, {
    required: true,
    maxLength: 2000,
    label: 'Message',
  })
  return { value, errors }
}

export function validateProject(body) {
  const value = {
    fullName: str(body.fullName),
    email: str(body.email),
    contactNumber: str(body.contactNumber),
    businessName: str(body.businessName),
    businessType: str(body.businessType),
    businessDescription: str(body.businessDescription),
    currentProcess: str(body.currentProcess),
    problem: str(body.problem),
    desiredOutcome: str(body.desiredOutcome),
    budget: str(body.budget),
    timeline: str(body.timeline),
    additionalInfo: str(body.additionalInfo),
  }
  const errors = {}
  check(errors, 'fullName', value.fullName, {
    required: true,
    maxLength: 100,
    label: 'Full name',
  })
  check(errors, 'email', value.email, {
    required: true,
    email: true,
    maxLength: 254,
    label: 'Email address',
  })
  check(errors, 'contactNumber', value.contactNumber, {
    maxLength: 50,
    label: 'Contact number',
  })
  check(errors, 'businessName', value.businessName, {
    required: true,
    maxLength: 150,
    label: 'Business / organization name',
  })
  check(errors, 'businessType', value.businessType, {
    maxLength: 150,
    label: 'Business type / industry',
  })
  check(errors, 'businessDescription', value.businessDescription, {
    required: true,
    maxLength: 2000,
    label: 'Business description',
  })
  check(errors, 'currentProcess', value.currentProcess, {
    maxLength: 2000,
    label: 'Current process',
  })
  check(errors, 'problem', value.problem, {
    required: true,
    maxLength: 2000,
    label: 'Problem',
  })
  check(errors, 'desiredOutcome', value.desiredOutcome, {
    required: true,
    maxLength: 2000,
    label: 'Desired outcome',
  })
  check(errors, 'budget', value.budget, { maxLength: 50, label: 'Budget' })
  check(errors, 'timeline', value.timeline, { maxLength: 50, label: 'Timeline' })
  check(errors, 'additionalInfo', value.additionalInfo, {
    maxLength: 2000,
    label: 'Additional information',
  })
  return { value, errors }
}
