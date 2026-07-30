import Hero from "@/components/sections/Hero"
import TrustBar from "@/components/sections/TrustBar"
import FeaturedProducts from "@/components/sections/FeaturedProducts"
import QuizBanner from "@/components/sections/QuizBanner"
import OriginsSection from "@/components/sections/OriginsSection"
import CoffeeBloomSection from "@/components/sections/CoffeeBloomSection"
import SubscriptionBanner from "@/components/sections/SubscriptionBanner"
import MobileBanner from "@/components/sections/MobileBanner"
import CorporateBanner from "@/components/sections/CorporateBanner"
import PhilosophySection from "@/components/sections/PhilosophySection"
import CoffeeBeansBanner from "@/components/sections/CoffeeBeansBanner"
import Reveal from "@/components/ui/Reveal"

export default function HomePage() {
  return (
    <div style={{ paddingTop: "6.75rem" }}>
      <Hero />
      <Reveal distance={24}>
        <TrustBar />
      </Reveal>
      <Reveal>
        <FeaturedProducts />
      </Reveal>
      <Reveal>
        <CoffeeBeansBanner />
      </Reveal>
      <Reveal>
        <QuizBanner />
      </Reveal>
      <Reveal>
        <OriginsSection />
      </Reveal>
      <Reveal distance={60}>
        <CoffeeBloomSection />
      </Reveal>
      <Reveal>
        <SubscriptionBanner />
      </Reveal>
      <Reveal distance={60}>
        <MobileBanner />
      </Reveal>
      <Reveal>
        <CorporateBanner />
      </Reveal>
      <Reveal>
        <PhilosophySection />
      </Reveal>
    </div>
  )
}
