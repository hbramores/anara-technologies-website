import { Route, Routes } from 'react-router-dom'
import RootLayout from './components/layout/RootLayout.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import HomePage from './pages/HomePage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import PlantwaisPage from './pages/PlantwaisPage.jsx'
import ServicesPage from './pages/ServicesPage.jsx'
import StartAProjectPage from './pages/StartAProjectPage.jsx'
import SystemsPage from './pages/SystemsPage.jsx'

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/systems" element={<SystemsPage />} />
        <Route path="/plantwais" element={<PlantwaisPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/start-a-project" element={<StartAProjectPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
