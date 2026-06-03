import Hero from "@/components/sections/Hero"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import SubscriptionBanner from "@/components/sections/SubscriptionBanner"
import OriginsSection from "@/components/sections/OriginsSection"
import MobileBanner from "@/components/sections/MobileBanner"
import CorporateBanner from "@/components/sections/CorporateBanner"
import PhilosophySection from "@/components/sections/PhilosophySection"

export default function HomePage() {
  return (
    <div style={{ paddingTop: "4rem" }}>
      <Hero />
      <FeaturedProducts />
      <SubscriptionBanner />
      <OriginsSection />
      <MobileBanner />
      <CorporateBanner />
      <PhilosophySection />
    </div>
  )
}
