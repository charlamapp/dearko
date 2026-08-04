"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const steps = [
  { num: "01", label: "Demleme yönteminizi" },
  { num: "02", label: "Tat tercihlerinizi" },
  { num: "03", label: "Kahve kişiliğinizi" },
]

export default function QuizBanner() {
  const [bg, setBg] = useState("#FFFFFF")
  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(c => {
      const v = c?.appearance?.quizBanner?.bg
      if (v) setBg(v)
    }).catch(() => {})
  }, [])

  return (
    <section style={{ background: bg, borderTop: "1px solid #EBEBEB", borderBottom: "1px solid #EBEBEB", overflow: "hidden", position: "relative" }}>

      {/* Dekoratif yeşil leke — sol alt */}
      <div style={{
        position: "absolute", left: -80, bottom: -80,
        width: 360, height: 360, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,129,69,0.10) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      {/* Dekoratif yeşil leke — sağ üst */}
      <div style={{
        position: "absolute", right: -60, top: -60,
        width: 280, height: 280, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(108,129,69,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="wrap section-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Sol: metin */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const }}
          >
            <p style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "#6C8145", marginBottom: "1rem" }}>
              Kahve Profil Testi
            </p>
            <h2 style={{
              fontFamily: "var(--font-inter)", fontWeight: 900,
              fontSize: "clamp(1.8rem, 4vw, 3rem)", lineHeight: 1.06,
              letterSpacing: "-0.03em", textTransform: "uppercase",
              color: "#1A1919", marginBottom: "1.25rem",
            }}>
              Sizin için<br />
              <span style={{ color: "#6C8145" }}>doğru kahveyi</span><br />
              bulalım.
            </h2>
            <p style={{ fontSize: "0.9375rem", color: "#5E5C5C", lineHeight: 1.75, marginBottom: "2rem", maxWidth: "26rem" }}>
              5 basit soruyla damak zevkinizi, demleme alışkanlıklarınızı ve flavor profilinizi analiz ediyoruz.
            </p>
            <Link href="/quiz"
              style={{
                display: "inline-flex", alignItems: "center", gap: "0.6rem",
                padding: "0.95rem 2rem", background: "#6C8145", color: "#fff",
                fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 700,
                letterSpacing: "0.07em", textTransform: "uppercase", textDecoration: "none",
                transition: "background 0.2s, transform 0.2s",
                boxShadow: "0 4px 16px rgba(108,129,69,0.25)",
              }}
              className="hover:bg-[#57692F]"
            >
              Teste Başla
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </motion.div>

          {/* Sağ: adımlar */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as const, delay: 0.1 }}
            style={{ display: "flex", flexDirection: "column", gap: "0.1rem" }}
          >
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                style={{
                  display: "flex", alignItems: "center", gap: "1.25rem",
                  padding: "1.25rem 0",
                  borderBottom: i < steps.length - 1 ? "1px solid #EBEBEB" : "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, background: "#6C8145",
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.1em", color: "#fff" }}>
                    {s.num}
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 600, color: "#1A1919" }}>
                  {s.label}
                </p>
              </motion.div>
            ))}

            {/* Süre */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", paddingTop: "1.5rem" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C8145" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              <span style={{ fontSize: "0.78rem", color: "#6C8145", fontFamily: "var(--font-inter)", fontWeight: 600 }}>
                2 dakikadan az sürer
              </span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
