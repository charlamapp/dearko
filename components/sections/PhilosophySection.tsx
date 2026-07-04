"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

const stats = [
  { value: 5000,  suffix: "+", label: "Aktif Abone",     desc: "Düzenli kahve tutkunları" },
  { value: 12,    suffix: "",  label: "Ülkeden Origin",   desc: "Küresel çiftçi ağı" },
  { value: 500,   suffix: "+", label: "Etkinlik",         desc: "Mobil araç hizmetleri" },
  { value: 48,    suffix: "sa", label: "İçinde Kargo",    desc: "Taze kavrum garantisi" },
]

const steps = [
  { num: "01", title: "Hasat",   desc: "Dünyanın en iyi bölgelerindeki çiftçilerle direkt ilişki." },
  { num: "02", title: "Kavrum",  desc: "İstanbul'daki atölyemizde sipariş sonrası taze kavrum." },
  { num: "03", title: "Kapınızda", desc: "48 saat içinde vakumlu ambalajıyla taze teslimat." },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const duration = 1600
        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * target))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [target])

  return <span ref={ref}>{count.toLocaleString("tr")}{suffix}</span>
}

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
}
const item = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.1, 0.25, 1] } },
}

export default function PhilosophySection() {
  return (
    <>
      {/* İstatistikler */}
      <section style={{ background: "#FFFFFF", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-2 md:grid-cols-4"
            style={{ borderTop: "1px solid #E8E8E8" }}
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} variants={item} className="py-10 px-4 lg:px-8 text-center"
                style={{ borderRight: i < stats.length - 1 ? "1px solid #E8E8E8" : "none" }}>
                <p style={{ fontFamily: "var(--font-inter)", fontWeight: 900, fontSize: "clamp(1.75rem, 3vw, 2.75rem)", color: "#2C2B2B", lineHeight: 1, marginBottom: "0.5rem" }}>
                  <AnimatedCounter target={s.value} suffix={s.suffix} />
                </p>
                <p className="label-ink mb-1">{s.label}</p>
                <p style={{ fontSize: "0.75rem", color: "#A0A0A0" }}>{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Nasıl çalışır */}
      <section className="section" style={{ background: "#F8F8F8", borderBottom: "1px solid #E8E8E8" }}>
        <div className="wrap">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p className="label mb-4">Süreç</p>
            <h2 className="heading-lg">Çiftlikten Fincanınıza</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-0 relative"
          >
            {/* Bağlantı çizgisi (desktop) */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px" style={{ background: "#E8E8E8", zIndex: 0 }} />

            {steps.map((s, i) => (
              <motion.div key={i} variants={item} className="relative z-10 flex flex-col items-center text-center px-8 py-8">
                <motion.div
                  className="w-16 h-16 flex items-center justify-center mb-6 relative"
                  style={{ background: "#5CADD4" }}
                  whileHover={{ scale: 1.08, background: "#4a9bc0" }}
                  transition={{ duration: 0.2 }}
                >
                  <span style={{ fontFamily: "var(--font-inter)", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "#fff" }}>
                    {s.num}
                  </span>
                </motion.div>
                <h3 style={{ fontFamily: "var(--font-inter)", fontSize: "1rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#2C2B2B", marginBottom: "0.75rem" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B6868", lineHeight: 1.7, maxWidth: "18rem" }}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  )
}
