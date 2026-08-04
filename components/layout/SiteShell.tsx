"use client"

import { usePathname } from "next/navigation"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { CartProvider } from "@/lib/cart"
import TrackVisit from "@/components/TrackVisit"
import PopupBanner from "@/components/PopupBanner"
import FacebookPixel from "@/components/FacebookPixel"

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")

  if (isAdmin) {
    return <>{children}</>
  }

  return (
    <CartProvider>
      <FacebookPixel />
      <TrackVisit />
      <PopupBanner />
      <Header />
      <main>{children}</main>
      <Footer />
    </CartProvider>
  )
}
