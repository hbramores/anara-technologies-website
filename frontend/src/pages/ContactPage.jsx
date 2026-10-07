import ContactForm from '../components/forms/ContactForm.jsx'
import Button from '../components/ui/Button.jsx'
import Container from '../components/ui/Container.jsx'
import Section from '../components/ui/Section.jsx'
import { ArrowRight } from '../components/ui/icons.jsx'

/*
 * E01 — Contact page UI (PRD 20). No private/home street address is published;
 * official email and social links are omitted until provided.
 */
function ContactPage() {
  return (
    <>
      <Section tone="light" aria-labelledby="contact-heading">
        <Container>
          <h1
            id="contact-heading"
            className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
          >
            Let’s talk.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            Have a question about ANARA, our systems, or working with us? Send
            us a message.
          </p>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <ContactForm />
            </div>

            <aside aria-labelledby="contact-info-heading">
              <h2
                id="contact-info-heading"
                className="text-2xl font-extrabold tracking-tight text-ink"
              >
                Company Information
              </h2>

              <dl className="mt-4 space-y-3 text-ink-muted">
                <div>
                  <dt className="text-sm font-semibold text-ink">Company</dt>
                  <dd>ANARA Technologies OPC</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold text-ink">Location</dt>
                  <dd>Naga City, Philippines</dd>
                </div>
              </dl>

              <p className="mt-4 text-sm text-ink-muted">
                Official email and social links will be added once they are
                available.
              </p>

              <div className="mt-8 rounded-card border border-magenta-100 bg-magenta-50 p-6">
                <h3 className="text-lg font-semibold text-ink">
                  Looking to build a system?
                </h3>
                <p className="mt-2 leading-relaxed text-ink-muted">
                  Start a project inquiry and tell us about your business.
                </p>
                <div className="mt-4">
                  <Button to="/start-a-project">
                    Start a Project
                    <ArrowRight />
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}

export default ContactPage
