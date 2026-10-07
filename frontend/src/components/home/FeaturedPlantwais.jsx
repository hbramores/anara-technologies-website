import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import ProductPreviewPlaceholder from '../ui/ProductPreviewPlaceholder.jsx'
import Section from '../ui/Section.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import { ArrowRight } from '../ui/icons.jsx'

/**
 * B03 — Featured PLANTWAIS.
 * Approved PRD 15.3 content on a strategic dark section.
 */
function FeaturedPlantwais() {
  return (
    <Section
      tone="dark"
      aria-labelledby="featured-plantwais-heading"
      className="relative overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-anara-gradient opacity-20 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-magenta-300">
              Featured System
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <h2
                id="featured-plantwais-heading"
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                PLANTWAIS
              </h2>
              <StatusBadge tone="dark">In Development</StatusBadge>
            </div>

            <p className="mt-5 text-lg leading-relaxed text-neutral-300">
              PLANTWAIS helps farmers plan before they plant by providing a
              clearer view of the expected activities, costs, and potential
              returns of a farm enterprise. It supports better planning and more
              informed decisions before farmers invest in a production cycle.
            </p>

            <div className="mt-8">
              <Button to="/plantwais" size="lg">
                Explore PLANTWAIS
                <ArrowRight />
              </Button>
            </div>
          </div>

          <ProductPreviewPlaceholder tone="dark" name="PLANTWAIS" />
        </div>
      </Container>
    </Section>
  )
}

export default FeaturedPlantwais
