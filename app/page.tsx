import Hero from "@/components/sections/Hero"
import TrustBar from "@/components/sections/TrustBar"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import QuizBanner from "@/components/sections/QuizBanner"
import OriginsSection from "@/components/sections/OriginsSection"
import SubscriptionBanner from "@/components/sections/SubscriptionBanner"
import MobileBanner from "@/components/sections/MobileBanner"
import CorporateBanner from "@/components/sections/CorporateBanner"
import PhilosophySection from "@/components/sections/PhilosophySection"

export default function HomePage() {
  return (
    <div style={{ paddingTop: "6.25rem" }}>
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <QuizBanner />
      <OriginsSection />
      <SubscriptionBanner />
      <MobileBanner />
      <CorporateBanner />
      <PhilosophySection />
    </div>
  )
}
