import { Outlet } from 'react-router-dom'
import AnalyticsTracker from '../system/AnalyticsTracker.jsx'
import SeoManager from '../system/SeoManager.jsx'
import Footer from './Footer.jsx'
import Header from './Header.jsx'

/**
 * Shared application shell: skip link, sticky header, routed main content,
 * and the global footer.
 */
function RootLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <SeoManager />
      <AnalyticsTracker />
      <a
        href="#main-content"
        className="sr-only rounded-full focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-magenta-700 focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default RootLayout
