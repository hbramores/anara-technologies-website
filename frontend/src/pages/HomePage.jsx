import AboutPreview from '../components/home/AboutPreview.jsx'
import FeaturedPlantwais from '../components/home/FeaturedPlantwais.jsx'
import FinalCta from '../components/home/FinalCta.jsx'
import Hero from '../components/home/Hero.jsx'
import HowWeWork from '../components/home/HowWeWork.jsx'
import ServicesPreview from '../components/home/ServicesPreview.jsx'
import WhatAnaraDoes from '../components/home/WhatAnaraDoes.jsx'

function HomePage() {
  return (
    <>
      <Hero />
      <WhatAnaraDoes />
      <FeaturedPlantwais />
      <ServicesPreview />
      <HowWeWork />
      <AboutPreview />
      <FinalCta />
    </>
  )
}

export default HomePage
