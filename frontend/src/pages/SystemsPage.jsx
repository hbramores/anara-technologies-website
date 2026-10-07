import { systems } from '../lib/systems.js'
import Button from '../components/ui/Button.jsx'
import Card from '../components/ui/Card.jsx'
import Container from '../components/ui/Container.jsx'
import ProductPreviewPlaceholder from '../components/ui/ProductPreviewPlaceholder.jsx'
import Section from '../components/ui/Section.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { ArrowRight } from '../components/ui/icons.jsx'

/**
 * C01 — Systems portfolio page.
 * Renders the approved systems registry, so future systems can be added
 * without redesigning the page. No placeholder/fake products are shown.
 */
function SystemsPage() {
  return (
    <>
      <Section tone="light" aria-labelledby="systems-heading">
        <Container>
          <h1
            id="systems-heading"
            className="max-w-3xl text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
          >
            Systems
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Digital systems developed under ANARA Technologies.
          </p>
        </Container>
      </Section>

      <Section tone="muted" aria-labelledby="systems-list-heading">
        <Container>
          <h2 id="systems-list-heading" className="sr-only">
            ANARA systems
          </h2>

          <ul className="grid gap-8">
            {systems.map((system) => (
              <li key={system.id}>
                <Card size="lg">
                  <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                          {system.name}
                        </h3>
                        <StatusBadge tone="light">{system.status}</StatusBadge>
                      </div>

                      {system.tagline && (
                        <p className="mt-3 text-lg font-semibold text-magenta-700">
                          {system.tagline}
                        </p>
                      )}

                      <p className="mt-4 leading-relaxed text-ink-muted">
                        {system.description}
                      </p>

                      <div className="mt-6">
                        <Button to={system.href}>
                          Explore {system.name}
                          <ArrowRight />
                        </Button>
                      </div>
                    </div>

                    <ProductPreviewPlaceholder
                      tone="light"
                      name={system.name}
                    />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    </>
  )
}

export default SystemsPage
