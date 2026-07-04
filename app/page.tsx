import Hero from "@/components/sections/Hero"
import TrustBar from "@/components/sections/TrustBar"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import SubscriptionBanner from "@/components/sections/SubscriptionBanner"
import OriginsSection from "@/components/sections/OriginsSection"
import MobileBanner from "@/components/sections/MobileBanner"
import CorporateBanner from "@/components/sections/CorporateBanner"
import PhilosophySection from "@/components/sections/PhilosophySection"

export default function HomePage() {
  return (
    <div style={{ paddingTop: "6.25rem" }}>
      <Hero />
      <TrustBar />
      <FeaturedProducts />
      <OriginsSection />
      <SubscriptionBanner />
      <MobileBanner />
      <CorporateBanner />
      <PhilosophySection />
    </div>
  )
}
