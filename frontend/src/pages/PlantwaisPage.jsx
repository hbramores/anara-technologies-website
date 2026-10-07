import PlantwaisHero from '../components/plantwais/PlantwaisHero.jsx'
import PlantwaisInfo from '../components/plantwais/PlantwaisInfo.jsx'
import PlantwaisStory from '../components/plantwais/PlantwaisStory.jsx'

/**
 * PLANTWAIS product page: C02 (hero) + C03 (story) + C04 (product info).
 */
function PlantwaisPage() {
  return (
    <>
      <PlantwaisHero />
      <PlantwaisStory />
      <PlantwaisInfo />
    </>
  )
}

export default PlantwaisPage
