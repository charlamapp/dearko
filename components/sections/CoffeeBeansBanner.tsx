"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

const DEFAULT_IMAGE = "/coffee-beans.jpg"

export default function CoffeeBeansBanner() {
  const [image, setImage] = useState(DEFAULT_IMAGE)

  useEffect(() => {
    fetch("/api/content").then(r => r.json()).then(c => {
      const img = c?.appearance?.coffeeBeansBanner?.image
      if (img) setImage(img)
    }).catch(() => {})
  }, [])

  return (
    <section style={{ background: "#FFFFFF", overflow: "hidden" }}>
      <div className="relative w-full" style={{ height: "clamp(380px, 45vw, 560px)" }}>

        {/* Görsel */}
        <motion.img
          src={image}
          alt="Specialty kahve çekirdekleri"
          className="w-full h-full"
          style={{ display: "block", objectFit: "cover", objectPosition: "center center" }}
          initial={{ opacity: 0, scale: 1.03 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Metin — görselin ortasındaki beyaz alana overlay */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center text-center px-6"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          <div>
            <p className="label mb-4" style={{ color: "#fff" }}>Çekirdek Kalitesi</p>

            <h2 className="heading-lg mb-5" style={{ color: "#fff" }}>
              Her Fincanda Hissedilen<br />
              <span style={{ color: "#fff" }}>Çekirdek Farkı.</span>
            </h2>

            <p className="body-xl mb-8 mx-auto" style={{ maxWidth: 500, color: "rgba(255,255,255,0.85)" }}>
              Dünyanın en iyi kahve bölgelerinden, hasat zamanında toplanan
              yeşil çekirdekleri sipariş sonrası kavuruyoruz.
              Taze, canlı, tam istediğiniz gibi.
            </p>

            <Link href="/magazin" className="inline-flex items-center gap-2" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.9rem 2rem", background: "#6C8145", color: "#fff", fontFamily: "var(--font-inter)", fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textDecoration: "none" }}>
              Tüm Kahveleri Keşfet
            </Link>
          </div>
        </motion.div>

      </div>
    </section>
  )
}
