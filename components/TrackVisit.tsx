"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export default function TrackVisit() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname.startsWith("/admin")) return
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: pathname }),
      keepalive: true,
    }).catch(() => {})
  }, [pathname])

  return null
}
