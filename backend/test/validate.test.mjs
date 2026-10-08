import assert from 'node:assert/strict'
import { test } from 'node:test'
import { validateContact, validateProject } from '../src/validate.js'

const validContact = {
  fullName: '  Jane Doe ',
  email: ' jane@example.com ',
  business: 'ANARA',
  subject: 'Hello',
  message: 'A message',
}

test('validateContact accepts a valid submission and trims values', () => {
  const { value, errors } = validateContact(validContact)
  assert.deepEqual(errors, {})
  assert.equal(value.fullName, 'Jane Doe')
  assert.equal(value.email, 'jane@example.com')
})

test('validateContact requires fullName, email, subject and message', () => {
  const { errors } = validateContact({})
  for (const field of ['fullName', 'email', 'subject', 'message']) {
    assert.ok(errors[field], `expected an error for ${field}`)
  }
})

test('validateContact rejects a malformed email', () => {
  const { errors } = validateContact({ ...validContact, email: 'not-an-email' })
  assert.equal(errors.email, 'Enter a valid email address.')
})

test('validateContact enforces the subject length limit', () => {
  const { errors } = validateContact({
    ...validContact,
    subject: 'x'.repeat(151),
  })
  assert.equal(errors.subject, 'Subject is too long.')
})

const validProject = {
  fullName: 'Jane',
  email: 'jane@example.com',
  businessName: 'Acme',
  businessDescription: 'We sell goods.',
  problem: 'Everything is manual.',
  desiredOutcome: 'Automate record keeping.',
}

test('validateProject accepts a minimal valid submission', () => {
  const { errors } = validateProject(validProject)
  assert.deepEqual(errors, {})
})

test('validateProject requires its required fields', () => {
  const { errors } = validateProject({})
  for (const field of [
    'fullName',
    'email',
    'businessName',
    'businessDescription',
    'problem',
    'desiredOutcome',
  ]) {
    assert.ok(errors[field], `expected an error for ${field}`)
  }
})

test('validateProject rejects a malformed email', () => {
  const { errors } = validateProject({ ...validProject, email: 'bad' })
  assert.equal(errors.email, 'Enter a valid email address.')
})
