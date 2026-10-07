import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/ui/Container.jsx'
import Section from '../components/ui/Section.jsx'
import { ArrowRight } from '../components/ui/icons.jsx'

/*
 * D01 — Services page (PRD 18). Plain-language descriptions, no pricing or
 * packages. Descriptions differ from the homepage preview, per the PRD.
 */
const services = [
  {
    title: 'Custom Software Development',
    description:
      'Systems designed specifically around business needs and workflows.',
  },
  {
    title: 'Web Application Development',
    description:
      'Web-based applications accessible through browsers for teams, customers, or operations.',
  },
  {
    title: 'Business & Management Systems',
    description:
      'Systems that help organize and manage records, transactions, workflows, and everyday operations.',
  },
  {
    title: 'UI/UX Design & Prototyping',
    description:
      'Design and interactive prototypes that help shape and test an idea before full development.',
  },
]

function ServicesPage() {
  return (
    <>
      <Section tone="light" aria-labelledby="services-heading">
        <Container>
          <h1
            id="services-heading"
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
          >
            Digital systems built around your business.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Every business has different needs. We start by understanding yours
            before deciding what technology can help.
          </p>
        </Container>
      </Section>

      <Section tone="muted" aria-labelledby="services-list-heading">
        <Container>
          <h2 id="services-list-heading" className="sr-only">
            Services
          </h2>
          <ul className="grid gap-6 sm:grid-cols-2">
            {services.map((service) => (
              <li key={service.title}>
                <Card size="lg" className="flex h-full flex-col gap-3">
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
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="light" aria-labelledby="services-cta-heading">
        <Container size="narrow">
          <div className="rounded-card border border-magenta-100 bg-magenta-50 p-6 text-center sm:p-10">
            <h2
              id="services-cta-heading"
              className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl"
            >
              Not sure what you need?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-ink-muted">
              You don’t need to know what type of system you need. Tell us about
              your business and the problem you’re trying to solve.
            </p>
            <div className="mt-6 flex justify-center">
              <Button to="/start-a-project" size="lg">
                Start a Project
                <ArrowRight />
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ServicesPage
