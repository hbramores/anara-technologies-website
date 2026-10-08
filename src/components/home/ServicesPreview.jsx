import Button from '../ui/Button.jsx'
import Card from '../ui/Card.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowRight } from '../ui/icons.jsx'

const services = [
  {
    title: 'Custom Software Development',
    description:
      'Digital solutions built around specific business needs and processes.',
  },
  {
    title: 'Web Application Development',
    description:
      'Web-based systems accessible through a browser for teams, customers, or business operations.',
  },
  {
    title: 'Business & Management Systems',
    description:
      'Systems that help organize records, operations, transactions, and everyday business processes.',
  },
  {
    title: 'UI/UX Design & Prototyping',
    description:
      'Clear and usable interfaces designed and tested before full development.',
  },
]

/**
 * B04 — Services preview.
 * Approved PRD 15.4 content. No pricing, packages, or capabilities beyond it.
 */
function ServicesPreview() {
  return (
    <Section tone="light" aria-labelledby="services-preview-heading">
      <Container>
        <h2
          id="services-preview-heading"
          className="max-w-2xl text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
        >
          What can we build for you?
        </h2>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {services.map((service) => (
            <Card key={service.title} size="lg" className="flex flex-col gap-3">
              <span
                aria-hidden="true"
                className="h-1.5 w-10 rounded-full bg-anara-gradient"
              />
              <h3 className="text-lg font-semibold text-ink">
                {service.title}
              </h3>
              <p className="leading-relaxed text-ink-muted">
                {service.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-10 rounded-card border border-magenta-100 bg-magenta-50 p-6 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-lg font-semibold text-ink">
              Not sure what kind of system you need? Tell us about the problem
              first.
            </p>
            <Button to="/start-a-project" size="lg" className="shrink-0">
              Start a Project
              <ArrowRight />
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default ServicesPreview
