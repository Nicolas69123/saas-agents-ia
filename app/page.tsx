import HeroSection from '@/components/Landing/HeroSection'
import AgentShowcase from '@/components/Landing/AgentShowcase'
import FeatureImage from '@/components/Landing/FeatureImage'
import PropositionValue from '@/components/Landing/PropositionValue'
import PricingSection from '@/components/Landing/PricingSection'
import CallToAction from '@/components/Landing/CallToAction'

export default function Home() {
  return (
    <div className="page-container">
      <HeroSection />
      <AgentShowcase />
      <FeatureImage />
      <PropositionValue />
      <PricingSection />
      <CallToAction />
    </div>
  )
}
