import { Fragment } from 'react'
import Card from '../ui/Card.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowDown, ArrowRight } from '../ui/icons.jsx'

const steps = [
  'Understand the Problem',
  'Find the Right Approach',
  'Build the System',
]

/**
 * B02 — What ANARA Does.
 * Approved PRD 15.2 content, kept plain-language for non-technical owners.
 */
function WhatAnaraDoes() {
  return (
    <Section tone="muted" aria-labelledby="what-anara-does-heading">
      <Container>
        <div className="max-w-3xl">
          <h2
            id="what-anara-does-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Digital Systems for Growing Businesses
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            Every business works differently. ANARA takes the time to understand
            how your business works, where problems happen, and where technology
            can help. We turn those needs into practical digital systems built
            around your operations.
          </p>
        </div>

        <ol className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-stretch sm:gap-4">
          {steps.map((step, index) => (
            <Fragment key={step}>
              <li className="flex flex-1">
                <Card className="flex w-full flex-col items-start gap-4">
                  <span
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-anara-gradient text-sm font-bold text-white"
                    aria-hidden="true"
                  >
                    {index + 1}
                  </span>
                  <p className="text-lg font-semibold text-ink">{step}</p>
                </Card>
              </li>
              {index < steps.length - 1 && (
                <li
                  aria-hidden="true"
                  className="flex items-center justify-center self-center text-magenta-600"
                >
                  <ArrowDown className="h-5 w-5 sm:hidden" />
                  <ArrowRight className="hidden h-5 w-5 sm:block" />
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

export default WhatAnaraDoes
