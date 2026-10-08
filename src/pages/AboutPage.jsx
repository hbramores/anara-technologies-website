import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/ui/Container.jsx'
import Section from '../components/ui/Section.jsx'
import { ArrowRight } from '../components/ui/icons.jsx'

const coreValues = [
  {
    title: 'Practicality',
    description: 'Technology should solve actual problems.',
  },
  {
    title: 'Purpose',
    description: 'Build with a clear reason and meaningful outcome.',
  },
  {
    title: 'Accessibility',
    description:
      'Make technology approachable and useful, especially for growing organizations.',
  },
  {
    title: 'Progress',
    description:
      'Build solutions that help people and businesses move forward.',
  },
]

/*
 * D02 — About page (PRD 19). Represents ANARA Technologies OPC as a company.
 * Company size, history, and experience are not exaggerated. Per an approved
 * privacy decision, no Founder or personal profile information is shown.
 */
function AboutPage() {
  return (
    <>
      <Section tone="light" aria-labelledby="about-heading">
        <Container>
          <h1
            id="about-heading"
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance text-ink sm:text-5xl"
          >
            A New Approach to Real-world Advancement.
          </h1>
          <p className="mt-4 max-w-2xl text-lg font-semibold text-magenta-700">
            Digital Systems for Growing Businesses
          </p>
        </Container>
      </Section>

      <Section tone="muted" aria-labelledby="about-story-heading">
        <Container size="narrow">
          <h2
            id="about-story-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Our Story
          </h2>
          <p className="mt-4 text-lg font-semibold text-ink">
            Technology should start with understanding a real problem and
            finding a practical way to solve it.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-muted">
            ANARA Technologies builds practical digital systems for real-world
            needs. We work with growing businesses and organizations to
            understand their challenges and turn them into solutions that make
            everyday work better.
          </p>
        </Container>
      </Section>

      <Section tone="light" aria-labelledby="about-vision-heading">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                id="about-vision-heading"
                className="text-2xl font-extrabold tracking-tight text-magenta-700 sm:text-3xl"
              >
                Vision
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                To make practical technology more accessible to businesses and
                communities working toward growth and progress.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight text-magenta-700 sm:text-3xl">
                Mission
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink">
                To understand real-world challenges and build practical,
                purposeful digital systems that help businesses and
                organizations improve how they work, make better decisions, and
                grow.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="muted" aria-labelledby="about-values-heading">
        <Container>
          <h2
            id="about-values-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Core Values
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {coreValues.map((value) => (
              <li key={value.title}>
                <Card size="lg" className="flex h-full flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-10 rounded-full bg-anara-gradient"
                  />
                  <h3 className="text-lg font-semibold text-ink">
                    {value.title}
                  </h3>
                  <p className="leading-relaxed text-ink-muted">
                    {value.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section tone="dark" aria-labelledby="about-cta-heading">
        <Container size="narrow">
          <div className="text-center">
            <h2
              id="about-cta-heading"
              className="text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl"
            >
              Have a problem technology might help solve?
            </h2>
            <div className="mt-8 flex justify-center">
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

export default AboutPage
