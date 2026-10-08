import Container from '../ui/Container.jsx'
import ProductPreviewPlaceholder from '../ui/ProductPreviewPlaceholder.jsx'
import Section from '../ui/Section.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'

/**
 * C02 — PLANTWAIS hero. Approved PRD 16/17 content, honest "In Development".
 */
function PlantwaisHero() {
  return (
    <Section
      tone="dark"
      aria-labelledby="plantwais-hero-heading"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 -top-24 h-96 w-96 rounded-full bg-anara-gradient opacity-20 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-magenta-300">
              An ANARA Technologies system
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h1
                id="plantwais-hero-heading"
                className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl"
              >
                PLANTWAIS
              </h1>
              <StatusBadge tone="dark">In Development</StatusBadge>
            </div>

            <p className="mt-4 text-xl font-semibold text-magenta-300">
              From PLAN to GROW.
            </p>

            <p className="mt-4 text-lg leading-relaxed text-neutral-300">
              A digital farm enterprise planning and decision-support platform
              designed to help farmers better understand the costs, potential
              returns, and decisions involved in starting and managing a farm
              enterprise.
            </p>
          </div>

          <ProductPreviewPlaceholder tone="dark" name="PLANTWAIS" />
        </div>
      </Container>
    </Section>
  )
}

export default PlantwaisHero
