import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { CartProvider } from "@/lib/cart"
import TrackVisit from "@/components/TrackVisit"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: { default: "DearKo Coffee — Specialty Kahve", template: "%s | DearKo" },
  description: "Specialty kahve — Taze kavrum, direkt ticaret. Etiyopya, Kolombiya, Guatemala ve daha fazlasından tek kökenli kahveler.",
  keywords: ["specialty kahve", "single origin", "taze kavrum", "direkt ticaret", "istanbul kahve"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased">
        <CartProvider>
          <TrackVisit />
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
