import ProjectForm from '../components/forms/ProjectForm.jsx'
import Container from '../components/ui/Container.jsx'
import Section from '../components/ui/Section.jsx'

/*
 * E02 — Start a Project page UI (PRD 21). No file upload in V1.
 */
function StartAProjectPage() {
  return (
    <>
      <Section tone="light" aria-labelledby="start-project-heading">
        <Container>
          <h1
            id="start-project-heading"
            className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
          >
            Tell us about the problem.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
            You don’t need to know what system you need. Tell us about your
            business, how you currently work, and what’s getting in the way.
          </p>
        </Container>
      </Section>

      <Section tone="muted">
        <Container>
          <div className="max-w-3xl">
            <ProjectForm />
          </div>
        </Container>
      </Section>
    </>
  )
}

export default StartAProjectPage
