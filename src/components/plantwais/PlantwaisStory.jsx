import Card from '../ui/Card.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'

/*
 * C03 — PLANTWAIS story.
 * Farmer-centered copy. "Plan before you plant" is the memorable message, while
 * the supporting copy stays inclusive of production cycles that do not
 * literally involve planting (e.g. broiler, milkfish). No new capabilities,
 * statistics, or internal technical detail.
 */
const capabilities = [
  {
    title: 'Plan a farm enterprise',
    description: 'Work through the planning of a farm business.',
  },
  {
    title: 'Understand potential costs and returns',
    description:
      'Consider the costs and potential returns involved before investing.',
  },
  {
    title: 'Make more informed decisions',
    description:
      'Use that information to decide with more confidence before investing.',
  },
]

function PlantwaisStory() {
  return (
    <Section tone="light" aria-labelledby="plantwais-problem-heading">
      <Container>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2
              id="plantwais-problem-heading"
              className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
            >
              The Problem
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-ink-muted">
              Farming takes investment, but it can be difficult to know what to
              expect before you start. How much will you need? What will you
              spend on? How much could you earn? Without a clear plan, farmers
              may have to make these decisions along the way.
            </p>
          </div>

          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              The Solution
            </h2>
            <p className="mt-4 text-xl font-semibold text-magenta-700">
              Plan before you plant.
            </p>
            <p className="mt-3 text-lg leading-relaxed text-ink-muted">
              PLANTWAIS helps farmers plan before they start. It creates a farm
              enterprise plan that shows the expected activities, costs, and
              potential returns before a production cycle begins — giving
              farmers a clearer picture of what it may take to start and what
              they could expect from their farm business.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            What PLANTWAIS Can Do
          </h2>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {capabilities.map((capability) => (
              <li key={capability.title}>
                <Card size="lg" className="flex h-full flex-col gap-3">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-10 rounded-full bg-anara-gradient"
                  />
                  <h3 className="text-lg font-semibold text-ink">
                    {capability.title}
                  </h3>
                  <p className="leading-relaxed text-ink-muted">
                    {capability.description}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  )
}

export default PlantwaisStory
