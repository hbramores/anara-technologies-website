import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import ProductPreviewPlaceholder from '../ui/ProductPreviewPlaceholder.jsx'
import Section from '../ui/Section.jsx'
import StatusBadge from '../ui/StatusBadge.jsx'
import yfcLogo from '../../assets/yfc-logo.jpg'

/*
 * C04 — PLANTWAIS product information.
 * Uses only PRD-approved content: the description, the In Development status,
 * and the PRD's suggested milestone view. No launch-oriented CTA.
 */
const howItWorks = [
  'Plan your farm enterprise.',
  'Review the costs and potential returns.',
  'Decide with more information before investing.',
]

const milestones = [
  'Research',
  'Development',
  'Validation',
  'Pilot',
  'Launch',
]

const currentMilestone = 'Development'

function PlantwaisInfo() {
  return (
    <>
      <Section tone="muted" aria-labelledby="plantwais-who-heading">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2
                id="plantwais-who-heading"
                className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
              >
                Who It’s For
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                PLANTWAIS is intended for farmers and farm enterprises planning
                or managing a farm business.
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                How It Works
              </h2>
              <ol className="mt-4 space-y-3">
                {howItWorks.map((step, index) => (
                  <li key={step} className="flex gap-3 text-lg text-ink-muted">
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-magenta-100 text-xs font-bold text-magenta-800"
                    >
                      {index + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Container>
      </Section>

      <Section tone="light" aria-labelledby="plantwais-preview-heading">
        <Container size="wide">
          <h2
            id="plantwais-preview-heading"
            className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl"
          >
            Product Preview
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            PLANTWAIS is still in development, so an interface preview will be
            shown once an approved version is available.
          </p>
          <div className="mt-8">
            <ProductPreviewPlaceholder tone="light" name="PLANTWAIS" />
          </div>
        </Container>
      </Section>

      <Section tone="dark" aria-labelledby="plantwais-status-heading">
        <Container>
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                id="plantwais-status-heading"
                className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                Development Status
              </h2>
              <StatusBadge tone="dark">In Development</StatusBadge>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-neutral-300">
              PLANTWAIS is not publicly launched yet. The current stage is shown
              below.
            </p>

            <ol className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2">
              {milestones.map((milestone, index) => (
                <li
                  key={milestone}
                  aria-current={
                    milestone === currentMilestone ? 'step' : undefined
                  }
                  className="flex items-center gap-3"
                >
                  <span
                    className={
                      milestone === currentMilestone
                        ? 'inline-flex items-center rounded-full border border-magenta-400/50 bg-magenta-500/15 px-3 py-1 text-sm font-semibold text-magenta-200'
                        : 'inline-flex items-center rounded-full border border-white/15 px-3 py-1 text-sm text-neutral-300'
                    }
                  >
                    {milestone}
                  </span>
                  {index < milestones.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="text-neutral-500"
                    >
                      →
                    </span>
                  )}
                </li>
              ))}
            </ol>

            <h2 className="mt-14 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              About the Project
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-neutral-300">
              PLANTWAIS is the first system developed under ANARA Technologies.
              It is being built as a farm enterprise planning and
              decision-support system, and it is currently in development.
            </p>

            <div className="mt-8 rounded-card border border-white/10 bg-white/5 p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <span className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white p-1.5">
                  <img
                    src={yfcLogo}
                    alt="Young Farmers Challenge Program logo"
                    width="48"
                    height="48"
                    decoding="async"
                    className="h-12 w-12 object-contain"
                  />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-magenta-300">
                    Support
                  </p>
                  <p className="mt-1 text-base font-medium text-neutral-200">
                    Supported through the Department of Agriculture’s Young
                    Farmers Challenge Program
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 rounded-card border border-white/10 bg-white/5 p-6 sm:p-8">
              <p className="text-lg font-semibold text-white">
                Interested in PLANTWAIS?
              </p>
              <div className="mt-4">
                <Button to="/contact" size="lg">
                  Contact ANARA
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default PlantwaisInfo
