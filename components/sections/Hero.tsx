"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"

type Slide = { id: string; image: string; position?: string; headline: string; sub: string; cta: string; href: string }

export default function Hero() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [cur, setCur] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    fetch("/api/content").then((r) => r.json()).then((c) => setSlides(c.hero))
  }, [])

  const next = useCallback(() => setCur((c) => (c + 1) % slides.length), [slides.length])
  const prev = () => setCur((c) => (c - 1 + slides.length) % slides.length)

  useEffect(() => {
    if (paused || slides.length <= 1) return
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [next, paused, slides.length])

  if (!slides.length) return (
    <div style={{ background: "#F0F0F0", height: "100svh", minHeight: 560 }} />
  )

  const s = slides[cur]

  return (
    <div
      className="relative overflow-hidden"
      style={{ height: "100svh", minHeight: 560, maxHeight: 960 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Arka plan */}
      {slides.map((slide, i) => (
        <img
          key={slide.id}
          src={slide.image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: slide.position ?? "center center",
            opacity: i === cur ? 1 : 0,
            transition: "opacity 0.9s ease",
            zIndex: i === cur ? 1 : 0,
          }}
        />
      ))}

      {/* Gradient — alt yarı */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.2) 55%, rgba(0,0,0,0) 100%)" }} />

      {/* Ok butonları */}
      <button onClick={prev} aria-label="Önceki"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center opacity-70 hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer" }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={next} aria-label="Sonraki"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center opacity-70 hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer" }}>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* İçerik */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 sm:px-8 lg:px-14 pb-12 lg:pb-20"
        style={{ maxWidth: "82rem", margin: "0 auto" }}>

        {/* Slide numarası */}
        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: "1.5rem", textTransform: "uppercase" }}>
          {String(cur + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>

        <h1 className="heading-xl whitespace-pre-line mb-4 lg:mb-5" style={{ color: "#fff", maxWidth: "24rem", textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}>
          {s.headline}
        </h1>
        <p style={{ fontSize: "clamp(0.875rem, 2vw, 1.0625rem)", color: "rgba(255,255,255,0.8)", lineHeight: 1.65, marginBottom: "2rem", maxWidth: "34rem" }}>
          {s.sub}
        </p>
        <Link href={s.href} className="btn-white">{s.cta}</Link>

        {/* Sayfa göstergeleri */}
        <div className="flex items-center gap-2 mt-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} aria-label={`Slayt ${i + 1}`}
              style={{
                width: i === cur ? 28 : 6, height: 3,
                background: i === cur ? "#fff" : "rgba(255,255,255,0.35)",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.35s ease",
              }} />
          ))}
        </div>
      </div>

    </div>
  )
}
