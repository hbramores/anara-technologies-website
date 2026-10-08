import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowRight } from '../ui/icons.jsx'

/**
 * B07 — Final homepage CTA.
 * Approved PRD 15.7 content on a strategic deep-magenta closing section.
 */
function FinalCta() {
  return (
    <Section
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-anara-gradient-deep text-white"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-black/10 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="final-cta-heading"
            className="text-3xl font-extrabold tracking-tight text-balance text-white sm:text-4xl lg:text-5xl"
          >
            Tell us what’s slowing your business down.
          </h2>

          <p className="mt-5 text-lg text-white/90 sm:text-xl">
            We’ll explore how technology can help.
          </p>

          <div className="mt-8 flex justify-center">
            <Button to="/start-a-project" size="lg" variant="secondary">
              Start a Project
              <ArrowRight />
            </Button>
          </div>

          <p className="mt-6 text-sm text-white/80">
            You don’t need to know what system you need. Start by telling us
            about the problem.
          </p>
        </div>
      </Container>
    </Section>
  )
}

export default FinalCta
