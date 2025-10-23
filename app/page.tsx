import HeroSection from '@/components/Landing/HeroSection'
import AgentShowcase from '@/components/Landing/AgentShowcase'
import PropositionValue from '@/components/Landing/PropositionValue'
import PricingSection from '@/components/Landing/PricingSection'
import CallToAction from '@/components/Landing/CallToAction'
import MouseGradient from '@/components/MouseGradient'

export default function Home() {
  return (
    <div className="page-container">
      <MouseGradient />
      <HeroSection />
      <AgentShowcase />
      <PropositionValue />
      <PricingSection />
      <CallToAction />
    </div>
  )
}
