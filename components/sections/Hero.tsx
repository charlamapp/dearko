"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type Slide = { id: string; image: string; position?: string; headline: string; sub: string; cta: string; href: string }

const STEAM_STREAMS = [
  { delay: "0s",    left: "0px",   height: 44 },
  { delay: "1.1s",  left: "14px",  height: 60 },
  { delay: "0.55s", left: "28px",  height: 36 },
]

function SteamParticles() {
  return (
    <div className="absolute z-[15] pointer-events-none"
      style={{ bottom: "32%", left: "clamp(2rem, 10%, 8rem)" }}>
      {STEAM_STREAMS.map((s, i) => (
        <div key={i} style={{
          position: "absolute",
          left: s.left,
          bottom: 0,
          width: 4,
          height: s.height,
          background: "linear-gradient(to top, rgba(255,255,255,0.65), transparent)",
          borderRadius: 2,
          filter: "blur(2px)",
          animation: `steam-rise 3.4s ease-in-out ${s.delay} infinite, steam-sway 2.2s ease-in-out ${s.delay} infinite`,
        }} />
      ))}
    </div>
  )
}

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
    <div className="hero-section" style={{ background: "#F0F0F0" }} />
  )

  const s = slides[cur]

  return (
    <div
      className="hero-section relative overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Video arka plan — /public/hero-video.mp4 varsa otomatik açılır */}
      <video
        id="hero-video"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ display: "none" }}
        onCanPlay={(e) => { (e.target as HTMLVideoElement).style.display = "block" }}
      >
        <source src="/hero-video.mp4" type="video/mp4" />
        <source src="/hero-video.webm" type="video/webm" />
      </video>

      {/* Slide görsel arkaplanlar */}
      {slides.map((slide, i) => (
        <div key={slide.id} className="absolute inset-0"
          style={{ opacity: i === cur ? 1 : 0, transition: "opacity 1.1s ease", zIndex: i === cur ? 1 : 0 }}>
          <img
            src={slide.image}
            alt=""
            className="absolute inset-0 w-full h-full"
            style={{ objectFit: "cover", objectPosition: slide.position ?? "center center" }}
          />
        </div>
      ))}

      {/* Gradient */}
      <div className="absolute inset-0 z-10"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 55%, rgba(0,0,0,0) 100%)" }} />

      {/* Steam efekti */}
      <SteamParticles />

      {/* Ok butonları */}
      <button onClick={prev} aria-label="Önceki"
        className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 items-center justify-center opacity-70 hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer" }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button onClick={next} aria-label="Sonraki"
        className="flex absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-11 sm:h-11 items-center justify-center opacity-70 hover:opacity-100"
        style={{ background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.25)", backdropFilter: "blur(6px)", color: "#fff", cursor: "pointer" }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* İçerik */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-5 sm:px-8 lg:px-14 pb-8 sm:pb-12 lg:pb-20"
        style={{ maxWidth: "82rem", margin: "0 auto" }}>

        <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.15em", color: "rgba(255,255,255,0.5)", marginBottom: "0.75rem", textTransform: "uppercase" }}>
          {String(cur + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
        </p>

        <AnimatePresence mode="wait">
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.55, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="heading-xl whitespace-pre-line mb-3 lg:mb-5"
              style={{ color: "#fff", maxWidth: "clamp(16rem, 80vw, 24rem)", textShadow: "0 2px 24px rgba(0,0,0,0.35)", fontSize: "clamp(1.75rem, 6vw, 4.25rem)" }}>
              {s.headline}
            </h1>
            <p className="hidden sm:block" style={{ fontSize: "clamp(0.9rem, 2.2vw, 1.15rem)", fontWeight: 400, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, marginBottom: "1.75rem", maxWidth: "34rem" }}>
              {s.sub}
            </p>
            <Link href={s.href} className="btn-white" style={{ fontSize: "0.75rem", padding: "0.75rem 1.5rem" }}>{s.cta}</Link>
          </motion.div>
        </AnimatePresence>

        {/* Sayfa göstergeleri */}
        <div className="flex items-center gap-2 mt-6 sm:mt-10">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} aria-label={`Slayt ${i + 1}`}
              style={{
                width: i === cur ? 24 : 5, height: 3,
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
