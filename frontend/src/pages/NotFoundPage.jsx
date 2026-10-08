import Button from '../components/ui/Button.jsx'
import Container from '../components/ui/Container.jsx'
import Section from '../components/ui/Section.jsx'

function NotFoundPage() {
  return (
    <Section tone="light" aria-labelledby="not-found-heading">
      <Container>
        <h1
          id="not-found-heading"
          className="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl"
        >
          Page Not Found
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-muted">
          The page you are looking for does not exist.
        </p>
        <div className="mt-8">
          <Button to="/">Back to Home</Button>
        </div>
      </Container>
    </Section>
  )
}

export default NotFoundPage
