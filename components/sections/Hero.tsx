"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

type Slide = { id: string; image: string; position?: string; headline: string; sub: string; cta: string; href: string }

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [cur, setCur] = useState(0)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setSlides(c.hero))
  }, [])

  if (!slides.length) return (
    <div style={{ background: "#F5F5F5", height: "100svh", minHeight: 500 }} />
  )

  const prev = () => setCur((c) => (c - 1 + slides.length) % slides.length)
  const next = () => setCur((c) => (c + 1) % slides.length)
  const s = slides[cur]

  return (
    <div className="relative overflow-hidden" style={{ height: "100svh", minHeight: 500, maxHeight: 900 }}>

      {/* Arka plan görseli */}
      <img
        key={s.id}
        src={s.image}
        alt=""
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: s.position ?? "center center" }}
      />

      {/* Gradient overlay — alt yarı */}
      <div className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0) 100%)" }} />

      {/* Ok butonları */}
      <button onClick={prev} aria-label="Önceki"
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)", color: "#fff", cursor: "pointer" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={next} aria-label="Sonraki"
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center"
        style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", backdropFilter: "blur(4px)", color: "#fff", cursor: "pointer" }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* İçerik — alt kısım */}
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 lg:pb-14"
        style={{ maxWidth: "80rem", margin: "0 auto" }}>

        <h1 className="heading-xl mb-3 whitespace-pre-line" style={{ color: "#ffffff" }}>
          {s.headline}
        </h1>
        <p style={{ fontSize: "clamp(0.875rem, 2.5vw, 1.0625rem)", color: "rgba(255,255,255,0.82)", lineHeight: 1.55, marginBottom: "1.5rem", maxWidth: "36rem" }}>
          {s.sub}
        </p>
        <Link href={s.href} className="btn-white inline-block">{s.cta}</Link>

        {/* Sayfa göstergeleri */}
        <div className="flex items-center gap-2 mt-8">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)}
              style={{
                width: i === cur ? 24 : 6, height: 6,
                background: i === cur ? "#fff" : "rgba(255,255,255,0.4)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.3s ease",
                borderRadius: 3,
              }} />
          ))}
        </div>
      </div>

    </div>
  )
}
