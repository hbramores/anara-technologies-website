import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { ArrowRight } from '../ui/icons.jsx'

/**
 * B01 — Homepage hero.
 * Approved PRD 15.1 copy. Purely presentational: an abstract brand-gradient
 * composition (no product imagery or invented claims), with subtle decoration.
 */
function Hero() {
  return (
    <Section
      tone="light"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-magenta-100 opacity-70 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-magenta-50 blur-3xl" />
      </div>

      <Container className="relative">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="max-w-xl">
            <p className="text-sm font-semibold tracking-wide text-magenta-700">
              A New Approach to Real-world Advancement
            </p>

            <h1
              id="hero-heading"
              className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight text-balance text-ink sm:text-5xl lg:text-6xl"
            >
              From business problems to working systems.
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-ink-muted">
              ANARA builds practical digital systems around the needs and
              challenges of growing businesses.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button to="/start-a-project" size="lg">
                Start a Project
                <ArrowRight />
              </Button>
              <Button to="/systems" size="lg" variant="secondary">
                Explore Our Systems
                <ArrowRight />
              </Button>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto aspect-square w-full max-w-sm sm:max-w-md lg:max-w-lg"
          >
            <div className="absolute inset-6 rounded-full bg-anara-gradient opacity-10 blur-2xl" />
            <div className="absolute inset-0 rounded-[2.5rem] border border-line" />
            <div className="absolute inset-[9%] rounded-[2rem] border border-magenta-100" />
            <div className="absolute inset-[20%] rounded-[1.75rem] bg-anara-gradient opacity-15" />
            <div className="absolute inset-[30%] flex items-center justify-center rounded-[1.5rem] border border-line bg-white shadow-sm">
              <div className="h-10 w-10 rounded-2xl bg-anara-gradient" />
            </div>
            <div className="absolute right-[14%] top-[20%] h-3.5 w-3.5 rounded-full bg-magenta-500" />
            <div className="absolute bottom-[18%] left-[16%] h-2.5 w-2.5 rounded-full bg-magenta-300" />
            <div className="absolute bottom-[30%] right-[10%] h-2 w-2 rounded-full bg-magenta-200" />
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default Hero
