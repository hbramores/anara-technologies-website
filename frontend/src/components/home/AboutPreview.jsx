import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowRight } from '../ui/icons.jsx'

/**
 * B06 — About ANARA preview.
 * Approved PRD 15.6 content only: meaning, introduction, philosophy, CTA.
 */
function AboutPreview() {
  return (
    <Section tone="light" aria-labelledby="about-preview-heading">
      <Container size="narrow">
        <h2
          id="about-preview-heading"
          className="text-3xl font-extrabold tracking-tight text-balance text-ink sm:text-4xl"
        >
          A New Approach to Real-world Advancement
        </h2>

        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          ANARA Technologies is a technology company focused on building
          practical digital systems for real-world needs. We work with growing
          businesses and organizations to understand their challenges and turn
          them into solutions that make everyday work better.
        </p>

        <p className="mt-6 border-l-2 border-magenta-500 pl-4 text-lg font-semibold text-ink">
          We believe technology should have a purpose: solve a problem, make
          something easier, or help people move forward.
        </p>

        <div className="mt-8">
          <Button to="/about" size="lg">
            Learn About ANARA
            <ArrowRight />
          </Button>
        </div>
      </Container>
    </Section>
  )
}

export default AboutPreview
