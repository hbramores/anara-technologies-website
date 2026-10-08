import { Link } from 'react-router-dom'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import Section from '../ui/Section.jsx'
import { primaryCta, primaryNav, systemsNav } from '../../lib/navigation.js'
import Logo from './Logo.jsx'

// Resolved once at module load (not during render).
const copyrightYear = new Date().getFullYear()

const linkClasses =
  'text-sm text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magenta-500 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-sm'

const headingClasses = 'text-sm font-semibold text-white'

/**
 * Global footer. Content is limited to information approved in the PRD;
 * contact email and social accounts are omitted until officially provided.
 */
function Footer() {
  return (
    <Section as="footer" tone="dark" size="compact">
      <Container>
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo inverse />
            <p className="mt-4 max-w-xs text-sm text-neutral-400">
              ANARA Technologies is a technology company focused on building
              practical digital systems for real-world needs.
            </p>
            <p className="mt-4 text-sm text-neutral-400">
              Naga City, Philippines
            </p>
          </div>

          <nav aria-label="Explore">
            <h2 className={headingClasses}>Explore</h2>
            <ul className="mt-4 space-y-3">
              {primaryNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClasses}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Systems">
            <h2 className={headingClasses}>Systems</h2>
            <ul className="mt-4 space-y-3">
              {systemsNav.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className={linkClasses}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className={headingClasses}>Start a Project</h2>
            <p className="mt-4 text-sm text-neutral-400">
              Tell us what’s slowing your business down. We’ll explore how
              technology can help.
            </p>
            <Button to={primaryCta.to} className="mt-4">
              {primaryCta.label}
            </Button>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-neutral-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-neutral-400">
            © {copyrightYear} ANARA Technologies OPC. All rights reserved.
          </p>
          <p className="text-sm text-neutral-400">
            PLANTWAIS is in development.
          </p>
        </div>
      </Container>
    </Section>
  )
}

export default Footer
