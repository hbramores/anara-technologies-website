import { Fragment } from 'react'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowDown, ArrowRight } from '../ui/icons.jsx'

const steps = [
  {
    number: '01',
    title: 'Understand',
    description:
      'We learn about your business, how you currently work, and the problem you want to solve.',
  },
  {
    number: '02',
    title: 'Plan',
    description:
      'We identify what the system needs to do and propose an approach that fits your needs.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'We design and develop the system while keeping you involved throughout the process.',
  },
  {
    number: '04',
    title: 'Launch & Improve',
    description:
      'We test, launch, and continue improving the system based on real use and feedback.',
  },
]

/**
 * B05 — How We Work.
 * Approved PRD 15.5 four-step process, shown as a static progression.
 */
function HowWeWork() {
  return (
    <Section tone="muted" aria-labelledby="how-we-work-heading">
      <Container>
        <h2
          id="how-we-work-heading"
          className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
        >
          How We Work
        </h2>

        <ol className="mt-12 flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-4">
          {steps.map((step, index) => (
            <Fragment key={step.number}>
              <li className="flex-1">
                <span
                  aria-hidden="true"
                  className="block h-1.5 w-12 rounded-full bg-anara-gradient"
                />
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  {`${step.number} — ${step.title}`}
                </h3>
                <p className="mt-2 leading-relaxed text-ink-muted">
                  {step.description}
                </p>
              </li>
              {index < steps.length - 1 && (
                <li
                  aria-hidden="true"
                  className="flex items-center justify-center self-center text-magenta-600"
                >
                  <ArrowDown className="h-5 w-5 lg:hidden" />
                  <ArrowRight className="hidden h-5 w-5 lg:block" />
                </li>
              )}
            </Fragment>
          ))}
        </ol>
      </Container>
    </Section>
  )
}

export default HowWeWork
