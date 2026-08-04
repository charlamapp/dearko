import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import SiteShell from "@/components/layout/SiteShell"
import ThemeInjector from "@/components/ThemeInjector"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: { default: "Mola Coffee — Specialty Kahve", template: "%s | Mola" },
  description: "Specialty kahve — Taze kavrum, direkt ticaret. Etiyopya, Kolombiya, Guatemala ve daha fazlasından tek kökenli kahveler.",
  keywords: ["specialty kahve", "single origin", "taze kavrum", "direkt ticaret", "istanbul kahve"],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://tmfyqybvyojsqupbsivx.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://cdn.jsdelivr.net" />
        <ThemeInjector />
      </head>
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  )
}
